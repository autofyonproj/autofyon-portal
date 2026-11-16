const fs = require('fs');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync('scratch/bmw_parsed.json', 'utf8'));
const crawled = JSON.parse(fs.readFileSync('scratch/bmw_crawled_images.json', 'utf8'));

// Model definitions mapping English slugs, Arabic names, and category
const modelConfigs = [
  {
    slug: 'bmw-1-series',
    name: '1 Series',
    name_ar: 'الفئة الأولى',
    category: 'Hatchback',
    crawledKey: '1-series',
    excelMatch: 'الفئة الأولى'
  },
  {
    slug: 'bmw-2-series',
    name: '2 Series Gran Coupe',
    name_ar: 'الفئة الثانية جران كوبيه',
    category: 'Coupe',
    crawledKey: '2-series',
    excelMatch: 'الفئة الثانية'
  },
  {
    slug: 'bmw-3-series',
    name: '3 Series Sedan',
    name_ar: 'الفئة الثالثة سيدان',
    category: 'Sedan',
    crawledKey: '3-series',
    excelMatch: 'الفئة الثالثة'
  },
  {
    slug: 'bmw-4-series',
    name: '4 Series Gran Coupe & Cabrio',
    name_ar: 'الفئة الرابعة',
    category: 'Coupe',
    crawledKey: '4-series',
    excelMatch: 'الفئة الرابعة'
  },
  {
    slug: 'bmw-5-series',
    name: '5 Series Sedan',
    name_ar: 'الفئة الخامسة سيدان',
    category: 'Sedan',
    crawledKey: '5-series',
    excelMatch: 'الفئة الخامسة'
  },
  {
    slug: 'bmw-7-series',
    name: '7 Series Sedan',
    name_ar: 'الفئة السابعة سيدان',
    category: 'Sedan',
    crawledKey: '7-series',
    excelMatch: 'الفئة السابعة'
  },
  {
    slug: 'bmw-x1',
    name: 'X1',
    name_ar: 'إكس 1',
    category: 'SUV',
    crawledKey: 'x1',
    excelMatch: 'X1'
  },
  {
    slug: 'bmw-x2',
    name: 'X2',
    name_ar: 'إكس 2',
    category: 'SUV',
    crawledKey: 'x2',
    excelMatch: 'X2'
  },
  {
    slug: 'bmw-x3',
    name: 'X3',
    name_ar: 'إكس 3',
    category: 'SUV',
    crawledKey: 'x3',
    excelMatch: 'X3'
  },
  {
    slug: 'bmw-x5',
    name: 'X5',
    name_ar: 'إكس 5',
    category: 'SUV',
    crawledKey: 'x5',
    excelMatch: 'X5'
  },
  {
    slug: 'bmw-x6',
    name: 'X6',
    name_ar: 'إكس 6',
    category: 'SUV',
    crawledKey: 'x6',
    excelMatch: 'X6'
  },
  {
    slug: 'bmw-x7',
    name: 'X7',
    name_ar: 'إكس 7',
    category: 'SUV',
    crawledKey: 'x7',
    excelMatch: 'X7'
  },
  {
    slug: 'bmw-i4',
    name: 'i4 Gran Coupe',
    name_ar: 'آي 4 جران كوبيه',
    category: 'Coupe',
    crawledKey: 'i4',
    excelMatch: 'i4'
  },
  {
    slug: 'bmw-i5',
    name: 'i5 Sedan',
    name_ar: 'آي 5 سيدان',
    category: 'Sedan',
    crawledKey: 'i5',
    excelMatch: 'i5'
  },
  {
    slug: 'bmw-i7',
    name: 'i7 Luxury Sedan',
    name_ar: 'آي 7 سيدان فاخرة',
    category: 'Sedan',
    crawledKey: 'i7',
    excelMatch: 'i7'
  },
  {
    slug: 'bmw-ix1',
    name: 'iX1',
    name_ar: 'آي إكس 1',
    category: 'SUV',
    crawledKey: 'ix1',
    excelMatch: 'iX1'
  },
  {
    slug: 'bmw-ix2',
    name: 'iX2',
    name_ar: 'آي إكس 2',
    category: 'SUV',
    crawledKey: 'ix2',
    excelMatch: 'iX2'
  },
  {
    slug: 'bmw-ix',
    name: 'iX',
    name_ar: 'آي إكس',
    category: 'SUV',
    crawledKey: 'ix',
    excelMatch: 'iX'
  }
];

function selectImagesForModel(cfg, globalUsedSet) {
  const cData = crawled[cfg.crawledKey] || {};
  let candidates = [];
  if (cData.scene7 && cData.scene7.length > 0) {
    candidates = cData.scene7;
  } else if (cData.dam && cData.dam.length > 0) {
    candidates = cData.dam;
  }

  // Filter out any already used in another model
  const available = candidates.filter(u => !globalUsedSet.has(u));

  const images = [];

  // Categorize
  const heroCandidates = available.filter(u => u.includes('stage') || u.includes('hero') || u.includes('banner') || u.includes('overview') || u.includes('ext_') || u.includes('exterior'));
  const extCandidates = available.filter(u => u.includes('ext_') || u.includes('alloy') || u.includes('wheel') || u.includes('kidney') || u.includes('grille') || u.includes('front') || u.includes('rear') || u.includes('side'));
  const intCandidates = available.filter(u => u.includes('int_') || u.includes('interior') || u.includes('dashboard') || u.includes('instrument') || u.includes('seat') || u.includes('steer'));
  const techCandidates = available.filter(u => u.includes('digital') || u.includes('driving') || u.includes('suspension') || u.includes('brake') || u.includes('idrive') || u.includes('tec-ani') || u.includes('assist'));

  function addImg(url, secId, capEn, capAr) {
    if (!url || globalUsedSet.has(url)) return;
    globalUsedSet.add(url);
    images.push({
      url,
      section_id: secId,
      caption: `BMW ${cfg.name} - ${capEn}`,
      caption_ar: `بي إم دبليو ${cfg.name_ar} - ${capAr}`,
      source_url: cData.pageUrl || 'https://www.bmw-egypt.com'
    });
  }

  // 1. Hero
  const hero = heroCandidates[0] || available[0];
  if (hero) addImg(hero, 'sec_1_identity', 'Official Agency Stage View', 'الصورة الرسمية من الوكيل');

  // 2. Exterior
  const ext = extCandidates.find(u => !globalUsedSet.has(u)) || available.find(u => !globalUsedSet.has(u));
  if (ext) addImg(ext, 'sec_auto_exterior', 'Exterior Design & Styling', 'التصميم الخارجي والديناميكي');

  const ext2 = extCandidates.find(u => !globalUsedSet.has(u)) || available.find(u => !globalUsedSet.has(u));
  if (ext2) addImg(ext2, 'sec_auto_exterior', 'Alloy Wheels & Details', 'الجنوط الرياضية والتفاصيل الخارجية');

  // 3. Interior
  const int1 = intCandidates.find(u => !globalUsedSet.has(u)) || available.find(u => !globalUsedSet.has(u));
  if (int1) addImg(int1, 'sec_auto_interior', 'Cockpit & Curved Display', 'مقصورة القيادة والشاشة المنحنية');

  const int2 = intCandidates.find(u => !globalUsedSet.has(u)) || available.find(u => !globalUsedSet.has(u));
  if (int2) addImg(int2, 'sec_auto_interior', 'Luxury Interior & Seating', 'المقاعد الجلدية والفرش الفاخر');

  // 4. Tech / Specs
  const tech = techCandidates.find(u => !globalUsedSet.has(u)) || available.find(u => !globalUsedSet.has(u));
  if (tech) addImg(tech, 'sec_auto_specs', 'Engine & Performance Dynamics', 'الأداء وهندسة المحرك');

  // If still less than 3, grab any remaining available
  for (const rem of available) {
    if (images.length >= 6) break;
    if (!globalUsedSet.has(rem)) {
      addImg(rem, 'sec_auto_exterior', 'Official Agency View', 'مظهر رسمي من الوكيل');
    }
  }

  return images;
}

const globalUsedSet = new Set();
const payloadModels = [];

for (const cfg of modelConfigs) {
  // Find matching specs rows with strict boundary
  const modelSpecsRows = parsed.specs.filter(s => {
    const m = s['الموديل'] || '';
    if (cfg.excelMatch === 'iX') {
      return m.includes('iX') && !m.includes('iX1') && !m.includes('iX2');
    }
    if (cfg.excelMatch === 'X1') {
      return m.includes('X1') && !m.includes('iX1');
    }
    if (cfg.excelMatch === 'X2') {
      return m.includes('X2') && !m.includes('iX2');
    }
    if (cfg.excelMatch === 'X3') {
      return m.includes('X3') && !m.includes('iX3');
    }
    return m.includes(cfg.excelMatch);
  });

  // Find brochure
  let brochureUrl = null;
  for (const b of parsed.brochures) {
    const bModel = b['الموديل'] || '';
    if (bModel.includes(cfg.excelMatch) || (cfg.slug === 'x1' && bModel.includes('X1')) || (cfg.slug === 'x2' && bModel.includes('X2'))) {
      const url = b['بروشور/صفحة الوكيل'];
      if (url && url.startsWith('http')) {
        brochureUrl = url.split('|')[0].trim();
        break;
      }
    }
  }
  if (!brochureUrl && modelSpecsRows.length > 0) {
    const candidate = modelSpecsRows[0]['مصدر الوكيل (بروشور/صفحة)'];
    if (candidate && candidate.startsWith('http')) {
      brochureUrl = candidate.split('|')[0].trim();
    }
  }

  // Select images
  const images = selectImagesForModel(cfg, globalUsedSet);

  // Build trims
  const trims = [];
  modelSpecsRows.forEach((row, rIdx) => {
    const rawTrim = String(row['الفئة / النسخة'] || `Trim ${rIdx + 1}`).trim();
    let cleanTrimSlug = rawTrim
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `trim-${rIdx + 1}`;

    cleanTrimSlug = `${cfg.slug}-${cleanTrimSlug}`;

    // Find price
    let priceEgp = null;
    const priceRow = parsed.prices.find(p => {
      const pMod = p['الموديل'] || '';
      const pTrim = p['الفئة'] || '';
      return pMod.includes(cfg.excelMatch) && (rawTrim.includes(pTrim) || pTrim.includes(rawTrim));
    });
    if (priceRow && typeof priceRow['السعر جنيه'] === 'number') {
      priceEgp = priceRow['السعر جنيه'];
    }

    // Parse specs values
    const cc = parseInt(row['سعة المحرك cc'], 10);
    const hp = parseInt(row['القوة حصان'], 10);
    const accel = parseFloat(row['0-100 ثانية']);
    const topSpeed = parseInt(row['السرعة القصوى كم/س'], 10);
    const fuelTank = parseInt(row['خزان الوقود لتر'], 10);
    const trunk = parseInt(row['الصندوق لتر'], 10);
    const weight = parseInt(row['وزن فارغ كجم'], 10);

    const trimSpecs = {};
    if (!isNaN(cc) && cc > 0) trimSpecs.displacement_cc = cc;
    if (!isNaN(hp) && hp > 0) trimSpecs.power_hp = hp;
    if (row['العزم نيوتن.متر @دورة']) trimSpecs.torque_nm = String(row['العزم نيوتن.متر @دورة']);
    if (row['ناقل الحركة']) trimSpecs.transmission = String(row['ناقل الحركة']);
    if (row['الوقود']) trimSpecs.fuel_type = String(row['الوقود']);
    if (!isNaN(accel) && accel > 0) trimSpecs.acceleration_0_100_s = accel;
    if (!isNaN(topSpeed) && topSpeed > 0) trimSpecs.top_speed_kmh = topSpeed;
    if (!isNaN(fuelTank) && fuelTank > 0) trimSpecs.fuel_tank_l = fuelTank;
    if (!isNaN(trunk) && trunk > 0) trimSpecs.trunk_capacity_l = trunk;
    if (!isNaN(weight) && weight > 0) trimSpecs.kerb_weight_kg = weight;
    if (row['الجنوط']) trimSpecs.wheels = String(row['الجنوط']);
    if (row['المقاعد']) trimSpecs.seats = parseInt(row['المقاعد'], 10) || 5;

    trims.push({
      slug: cleanTrimSlug,
      name: rawTrim,
      name_ar: rawTrim,
      price_egp: priceEgp,
      specs: trimSpecs
    });
  });

  payloadModels.push({
    slug: cfg.slug,
    name: cfg.name,
    name_ar: cfg.name_ar,
    category: cfg.category,
    year: 2026,
    brochure_url: brochureUrl || 'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf',
    images,
    trims
  });
}

const finalPayload = {
  brand: {
    slug: 'bmw',
    name: 'BMW',
    name_ar: 'بي إم دبليو',
    origin: 'Germany',
    logo_url: 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset/logos/optimized/bmw.svg'
  },
  agency: {
    slug: 'global-auto-egypt',
    name: 'Global Auto Group - BMW Egypt',
    name_ar: 'مجموعة جلوبال أوتو - وكيل بي إم دبليو في مصر',
    type_id: 'main_agency',
    phone: '19269',
    website: 'https://www.bmw-egypt.com'
  },
  models: payloadModels
};

fs.writeFileSync('autoportal/scripts/data_bmw.json', JSON.stringify(finalPayload, null, 2), 'utf8');
console.log(`Generated data_bmw.json with ${finalPayload.models.length} models and ${globalUsedSet.size} unique official images!`);
