/**
 * smart-filter-and-import.js
 * 
 * Ingests and smartly filters all 2,905 Egyptian automotive businesses from data_unified_clean_utf8.csv.
 * Performs:
 *  - Categorization mapping (showroom, main_agency, distributor, service_center, spare_parts, etc.)
 *  - Egyptian phone/mobile normalization (handles 016/017/018/019 legacy to 11-digit 0106/0127/0118/0129)
 *  - Area code and landline standardizations
 *  - Governorate and district cleanup and inference
 *  - Deduplication
 *  - Generates idempotent SQL and executes against Cloudflare D1 (remote)
 */

const fs = require('fs');
const path = require('path');

function parseCsv(content) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else if (char === '\r' && !inQuotes) {
      // skip CR
    } else {
      current += char;
    }
  }
  if (current) lines.push(current);

  const parsed = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let field = '';
    let fieldQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (fieldQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          fieldQuotes = !fieldQuotes;
        }
      } else if (c === ',' && !fieldQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += c;
      }
    }
    row.push(field.trim());
    parsed.push(row);
  }
  return parsed;
}

function normalizeEgyptianPhone(raw) {
  if (!raw) return { phone: null, type: null, isMobile: false, isHotline: false };
  let digits = raw.replace(/\D/g, '');
  if (!digits) return { phone: null, type: null, isMobile: false, isHotline: false };

  // Remove international prefix 002 or +20 or 20
  if (digits.startsWith('0020')) digits = digits.slice(4);
  else if (digits.startsWith('20') && digits.length >= 11) digits = digits.slice(2);

  // If 5 digits -> Hotline (e.g. 19788, 16424, 19095, 16661)
  if (digits.length === 5 && (digits.startsWith('19') || digits.startsWith('16'))) {
    return { phone: digits, type: 'hotline', isMobile: false, isHotline: true };
  }

  // Convert old 10-digit mobile formats:
  // 016 -> 0106, 017 -> 0127, 018 -> 0118, 019 -> 0129
  if (digits.length === 10 && digits.startsWith('01')) {
    const prefix2 = digits.slice(0, 3);
    const rest = digits.slice(3);
    if (prefix2 === '016') digits = '0106' + rest;
    else if (prefix2 === '017') digits = '0127' + rest;
    else if (prefix2 === '018') digits = '0118' + rest;
    else if (prefix2 === '019') digits = '0129' + rest;
  }

  // Modern 11-digit mobile: 010, 011, 012, 015
  if (digits.length === 11 && (digits.startsWith('010') || digits.startsWith('011') || digits.startsWith('012') || digits.startsWith('015'))) {
    return { phone: digits, type: 'mobile', isMobile: true, isHotline: false };
  }

  // If starts with 10, 11, 12, 15 and is 10 digits (missing leading 0)
  if (digits.length === 10 && (digits.startsWith('10') || digits.startsWith('11') || digits.startsWith('12') || digits.startsWith('15'))) {
    return { phone: '0' + digits, type: 'mobile', isMobile: true, isHotline: false };
  }

  // Standard Landline:
  // 8 digits starting with 2 or 3 -> Cairo/Giza (02)
  if (digits.length === 8 && (digits.startsWith('2') || digits.startsWith('3'))) {
    return { phone: '02' + digits, type: 'landline', isMobile: false, isHotline: false };
  }

  // 10 digits starting with 02
  if (digits.length === 10 && digits.startsWith('02')) {
    return { phone: digits, type: 'landline', isMobile: false, isHotline: false };
  }

  // Alexandria (03): 7 digits starting with 4 or 5
  if (digits.length === 7 && (digits.startsWith('4') || digits.startsWith('5') || digits.startsWith('3'))) {
    return { phone: '03' + digits, type: 'landline', isMobile: false, isHotline: false };
  }

  // Return clean digits if length >= 7
  if (digits.length >= 7) {
    return { phone: digits, type: 'landline', isMobile: false, isHotline: false };
  }

  return { phone: null, type: null, isMobile: false, isHotline: false };
}

function mapCategory(cat, subcat) {
  const combined = `${cat} ${subcat}`.trim();
  if (combined.includes('قطع غيار')) return 'parts_supplier';
  if (combined.includes('صيانة') || combined.includes('خدمة') || combined.includes('مركز صيانة')) return 'service_center';
  if (combined.includes('تأجير') || combined.includes('ليموزين')) return 'rental_company';
  if (combined.includes('تأمين')) return 'insurer';
  if (combined.includes('تمويل') || combined.includes('بنك')) return 'finance_company';
  if (combined.includes('تعليم قيادة') || combined.includes('مدارس')) return 'driving_school';
  if (combined.includes('مصنع')) return 'manufacturer';
  if (combined.includes('وكيل حصري') || combined.includes('الصانع') || combined.includes('توكيل') || cat === 'وكيل') return 'authorized_agent';
  if (combined.includes('موزع')) return 'distributor';
  if (combined.includes('معرض') || combined.includes('تاجر') || combined.includes('تجارة')) return 'showroom';
  return 'showroom';
}

function inferGovernorateAndDistrict(address, districtRaw, cityRaw) {
  let gov = (cityRaw || '').trim();
  let dist = (districtRaw || '').trim();
  const addr = (address || '').trim();

  // Common district mappings to Governorates
  const cairoDistricts = [
    'مدينة نصر', 'مصر الجديدة', 'المعادي', 'المعادى', 'شبرا', 'حلوان', 'عين شمس',
    'المقطم', 'النزهة', 'النزهه', 'الزيتون', 'حدائق القبة', 'باب اللوق', 'وسط البلد',
    'العباسية', 'الظاهر', 'غمرة', 'التجمع', 'القاهرة الجديدة', 'الرحاب', 'الشروق', 'بدر', 'السلام', 'المنيل'
  ];
  const gizaDistricts = [
    'المهندسين', 'الدقي', 'الدقى', 'العجوزة', 'العجوزه', 'الهرم', 'فيصل', 'الجيزة',
    '6 أكتوبر', '6أكتوبر', 'السادس من أكتوبر', 'الشيخ زايد', 'العمرانية', 'إمبابة', 'امبابة', 'أبو رواش', 'ابورواش'
  ];
  const alexDistricts = [
    'سموحة', 'سموحه', 'سيدي جابر', 'سيدى جابر', 'سبورتنج', 'جليم', 'لوران', 'ميامي',
    'ميامى', 'العصافرة', 'العجمي', 'محرم بك', 'المنشية', 'الإبراهيمية', 'الرمل', 'العامرية'
  ];

  const fullText = `${dist} ${addr} ${gov}`;

  // Check Giza first
  for (const d of gizaDistricts) {
    if (fullText.includes(d)) {
      gov = 'الجيزة';
      if (!dist) dist = d;
      break;
    }
  }

  // Check Cairo
  if (!gov || gov === 'القاهرة' || gov === 'القاهره') {
    for (const d of cairoDistricts) {
      if (fullText.includes(d)) {
        gov = 'القاهرة';
        if (!dist) dist = d;
        break;
      }
    }
  }

  // Check Alex
  for (const d of alexDistricts) {
    if (fullText.includes(d)) {
      gov = 'الإسكندرية';
      if (!dist) dist = d;
      break;
    }
  }

  // Cleanup governorate names
  if (gov.includes('القاهرة') || gov.includes('القاهره')) gov = 'القاهرة';
  else if (gov.includes('الجيزة') || gov.includes('الجيزه') || gov.includes('6 اكتوبر')) gov = 'الجيزة';
  else if (gov.includes('الأسكندرية') || gov.includes('الاسكندرية') || gov.includes('الإسكندرية')) gov = 'الإسكندرية';
  else if (gov.includes('الشرقية') || gov.includes('الشرقيه') || gov.includes('الزقازيق') || gov.includes('العاشر')) gov = 'الشرقية';
  else if (gov.includes('الغربية') || gov.includes('الغربيه') || gov.includes('طنطا') || gov.includes('المحلة')) gov = 'الغربية';
  else if (gov.includes('الدقهلية') || gov.includes('الدقهليه') || gov.includes('المنصورة') || gov.includes('المنصوره')) gov = 'الدقهلية';
  else if (gov.includes('القليوبية') || gov.includes('القليوبيه') || gov.includes('بنها') || gov.includes('القلبوبية')) gov = 'القليوبية';
  else if (gov.includes('المنوفية') || gov.includes('المنوفيه') || gov.includes('شبين')) gov = 'المنوفية';
  else if (gov.includes('البحيرة') || gov.includes('البحيره') || gov.includes('دمنهور')) gov = 'البحيرة';
  else if (gov.includes('كفر الشيخ')) gov = 'كفر الشيخ';
  else if (gov.includes('دمياط')) gov = 'دمياط';
  else if (gov.includes('بورسعيد')) gov = 'بورسعيد';
  else if (gov.includes('الإسماعيلية') || gov.includes('الاسماعيلية') || gov.includes('الاسماعلية')) gov = 'الإسماعيلية';
  else if (gov.includes('السويس')) gov = 'السويس';
  else if (gov.includes('بني سويف') || gov.includes('بنى سويف')) gov = 'بني سويف';
  else if (gov.includes('المنيا')) gov = 'المنيا';
  else if (gov.includes('أسيوط') || gov.includes('اسيوط')) gov = 'أسيوط';
  else if (gov.includes('سوهاج')) gov = 'سوهاج';
  else if (gov.includes('قنا')) gov = 'قنا';
  else if (gov.includes('الأقصر') || gov.includes('الاقصر')) gov = 'الأقصر';
  else if (gov.includes('أسوان') || gov.includes('اسوان')) gov = 'أسوان';
  else if (gov.includes('البحر الاحمر') || gov.includes('البحرالاحمر') || gov.includes('الغردقة') || gov.includes('الغردقه') || gov.includes('شرم')) gov = 'البحر الأحمر';
  else if (gov.includes('مطروح')) gov = 'مطروح';
  else if (!gov) gov = 'القاهرة'; // Default major cluster

  return { governorate: gov, district: dist || 'المركز الرئيسي' };
}

function slugify(name, city, idSuffix) {
  let s = name
    .toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  if (!s || s === 'vendor') s = 'showroom';
  return `${s}-${idSuffix}`;
}

async function main() {
  const filePath = path.join(__dirname, '..', 'data_unified_clean_utf8.csv');
  const raw = fs.readFileSync(filePath, 'utf8');
  const rows = parseCsv(raw);

  console.log(`Loaded ${rows.length} rows from CSV`);
  const header = rows[0];
  console.log('Columns:', header.join(' | '));

  // Skip summary at the bottom (lines starting with 'ملخص' or similar)
  const validDataRows = rows.slice(1).filter((r) => {
    const name = r[0] || '';
    if (!name.trim()) return false;
    if (name.includes('ملخص الدليل') || name.includes('إجمالي السجلات') || name.includes('حسب التصنيف')) return false;
    if (name.endsWith('.xlsx') || name.endsWith('.docx') || name.endsWith('.htm')) return false;
    return true;
  });

  console.log(`Filtered valid business rows: ${validDataRows.length}`);

  // Deduplicate and process
  const prospects = [];
  const seenKeys = new Set();
  let index = 0;

  for (const r of validDataRows) {
    const name = (r[0] || '').trim();
    const originalCat = (r[1] || '').trim();
    const subcat = (r[2] || '').trim();
    const brand = (r[3] || '').trim();
    const origin = (r[4] || '').trim();
    const address = (r[5] || '').trim();
    const districtRaw = (r[6] || '').trim();
    const cityRaw = (r[7] || '').trim();
    const tel1 = r[8] || '';
    const tel2 = r[9] || '';
    const tel3 = r[10] || '';
    const mob1 = r[11] || '';
    const mob2 = r[12] || '';
    const fax = r[13] || '';
    const otherPhones = r[14] || '';
    const contact = (r[15] || '').trim();
    const email = (r[16] || '').trim();
    const notes = (r[17] || '').trim();
    const sources = (r[18] || '').trim();
    const sourceCount = parseInt(r[19] || '1', 10) || 1;

    // Filter out foreign records (Qatar / Saudi)
    if (cityRaw.includes('قطر') || cityRaw.includes('السعودية') || address.includes('قطر') || address.includes('السعودية')) {
      continue;
    }

    // Normalize Location
    const { governorate, district } = inferGovernorateAndDistrict(address, districtRaw, cityRaw);

    // Normalize Phones
    const rawPhones = [mob1, mob2, tel1, tel2, tel3, otherPhones, fax];
    const phonesObj = {};
    let whatsappMobile = null;
    let hotline = null;
    let anyPhoneCount = 0;

    rawPhones.forEach((p) => {
      if (!p) return;
      // might have multiple delimited numbers e.g. "24177641, 0101234567"
      const parts = p.split(/[,/;\-\s]+/).map((x) => x.trim()).filter((x) => x.length >= 5);
      parts.forEach((part) => {
        const norm = normalizeEgyptianPhone(part);
        if (norm.phone) {
          anyPhoneCount++;
          if (norm.isHotline) {
            hotline = norm.phone;
            phonesObj.hotline = norm.phone;
          } else if (norm.isMobile && !whatsappMobile) {
            whatsappMobile = norm.phone;
            phonesObj.mobile = norm.phone;
            phonesObj.whatsapp = norm.phone;
          } else {
            const key = `phone_${anyPhoneCount}`;
            if (!phonesObj[key]) phonesObj[key] = norm.phone;
          }
        }
      });
    });

    const categoryKey = mapCategory(originalCat, subcat);
    const primaryPhone = whatsappMobile || hotline || Object.values(phonesObj)[0] || '';

    // Deduplication Key
    const normalizedName = name.replace(/[\s\-_]/g, '').toLowerCase();
    const dedupKey = primaryPhone ? `${normalizedName}_${primaryPhone.slice(-7)}` : `${normalizedName}_${district}`;

    if (seenKeys.has(dedupKey)) {
      continue;
    }
    seenKeys.add(dedupKey);

    index++;
    const prospectId = `prsp_eg_${String(index).padStart(4, '0')}`;
    const slug = slugify(name, governorate, String(index).padStart(3, '0'));
    const isFreeEligible = ['showroom', 'distributor', 'authorized_agent', 'dealer', 'agent', 'service_center'].includes(categoryKey) && primaryPhone.length >= 7 ? 1 : 0;

    prospects.push({
      id: prospectId,
      name,
      original_category: originalCat,
      original_subcategory: subcat,
      category_key: categoryKey,
      brand,
      origin,
      address,
      district,
      city: governorate,
      phones: JSON.stringify(phonesObj),
      primary_phone: primaryPhone,
      whatsapp: whatsappMobile || '',
      contact_name: contact,
      email,
      notes,
      source_names: sources,
      source_count: sourceCount,
      source_row: index,
      country_code: 'EG',
      duplicate_key: dedupKey,
      has_phone: primaryPhone ? 1 : 0,
      free_offer_eligible: isFreeEligible,
      campaign_status: 'new',
      slug,
    });
  }

  console.log(`Smart filtered down to ${prospects.length} high-quality unique Egyptian automotive businesses.`);

  // Write out cleaned JSON dataset for the App directory
  const jsonDest = path.join(__dirname, '..', 'src', 'data', 'egypt_dealers_directory.json');
  fs.mkdirSync(path.dirname(jsonDest), { recursive: true });
  fs.writeFileSync(jsonDest, JSON.stringify(prospects, null, 2), 'utf8');
  console.log(`Saved rich catalog to ${jsonDest} (${(fs.statSync(jsonDest).size / 1024).toFixed(1)} KB)`);

  // Write out SQL insertion batches for Cloudflare D1
  const sqlStatements = [];
  for (const p of prospects) {
    const esc = (s) => (s || '').replace(/'/g, "''");
    sqlStatements.push(`
INSERT INTO vendor_prospects (
  id, name, original_category, original_subcategory, category_key, brand, origin,
  address, district, city, phones, contact_name, email, notes, source_names,
  source_count, source_row, country_code, duplicate_key, has_phone, free_offer_eligible,
  campaign_status
) VALUES (
  '${esc(p.id)}', '${esc(p.name)}', '${esc(p.original_category)}', '${esc(p.original_subcategory)}',
  '${esc(p.category_key)}', '${esc(p.brand)}', '${esc(p.origin)}', '${esc(p.address)}',
  '${esc(p.district)}', '${esc(p.city)}', '${esc(p.phones)}', '${esc(p.contact_name)}',
  '${esc(p.email)}', '${esc(p.notes)}', '${esc(p.source_names)}', ${p.source_count},
  ${p.source_row}, 'EG', '${esc(p.duplicate_key)}', ${p.has_phone}, ${p.free_offer_eligible},
  'new'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  phones = excluded.phones,
  category_key = excluded.category_key,
  city = excluded.city,
  district = excluded.district,
  address = excluded.address,
  free_offer_eligible = excluded.free_offer_eligible;
`.trim());
  }

  const sqlDest = path.join(__dirname, 'seed_filtered_prospects.sql');
  fs.writeFileSync(sqlDest, sqlStatements.join('\n\n'), 'utf8');
  console.log(`Generated SQL at ${sqlDest} with ${sqlStatements.length} statements.`);
}

main().catch(console.error);
