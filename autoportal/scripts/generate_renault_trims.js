const fs = require('fs');

const trims = [
  // ── 1. Austral Trims ──────────────────────────────────────────
  {
    id: 'biz_trim_austral_evolution',
    slug: 'austral-evolution',
    name: 'Evolution',
    name_ar: 'إيفولوشن (الفئة القياسية)',
    parent_business_id: 'biz_model_renault_austral',
    custom_data: {
      sec_listing_price: { official_price_egp: 1550000 },
      sec_auto_specs: { power_hp: 150, torque_nm: 250, transmission_type: 'CVT-X أوتوماتيك', wheels: '18-inch alloy' }
    }
  },
  {
    id: 'biz_trim_austral_techno',
    slug: 'austral-techno',
    name: 'Techno',
    name_ar: 'تكنو (الفئة المتوسطة)',
    parent_business_id: 'biz_model_renault_austral',
    custom_data: {
      sec_listing_price: { official_price_egp: 1690000 },
      sec_auto_specs: { power_hp: 150, infotainment_size_in: 9.0, digital_cluster_size_in: 12.3, ambient_lighting: 1 }
    }
  },
  {
    id: 'biz_trim_austral_iconic',
    slug: 'austral-iconic',
    name: 'Iconic',
    name_ar: 'أيكونيك (الفئة الفاخرة)',
    parent_business_id: 'biz_model_renault_austral',
    custom_data: {
      sec_listing_price: { official_price_egp: 1790000 },
      sec_auto_specs: { power_hp: 150, sunroof: 'سقف بانورامي عريض', wheels: '19-inch alloy' }
    }
  },
  {
    id: 'biz_trim_austral_esprit_alpine',
    slug: 'austral-esprit-alpine',
    name: 'Esprit Alpine',
    name_ar: 'إسبريت ألبين (الفئة الرياضية العليا)',
    parent_business_id: 'biz_model_renault_austral',
    custom_data: {
      sec_listing_price: { official_price_egp: 1890000 },
      sec_auto_specs: { power_hp: 150, wheels: '20-inch Daytona alloy', seating_material: 'فرش ألكانتارا بخياطة ألبين الزرقاء' }
    }
  },

  // ── 2. Megane Trims ───────────────────────────────────────────
  {
    id: 'biz_trim_megane_dynamic',
    slug: 'megane-dynamic',
    name: 'Dynamic 1.6L',
    name_ar: 'دايناميك 1.6 لتر',
    parent_business_id: 'biz_model_renault_megane',
    custom_data: {
      sec_listing_price: { official_price_egp: 1220000 },
      sec_auto_specs: { engine_type: '1.6L Naturally Aspirated 115hp', transmission_type: 'CVT Automatic', wheels: '16-inch alloy' }
    }
  },
  {
    id: 'biz_trim_megane_signature_na',
    slug: 'megane-signature-16',
    name: 'Signature 1.6L',
    name_ar: 'سيجنتشر 1.6 لتر بانوراما',
    parent_business_id: 'biz_model_renault_megane',
    custom_data: {
      sec_listing_price: { official_price_egp: 1330000 },
      sec_auto_specs: { engine_type: '1.6L Naturally Aspirated 115hp', sunroof: 'فتحة سقف بانورامية كهربائية', wheels: '17-inch alloy' }
    }
  },
  {
    id: 'biz_trim_megane_signature_turbo',
    slug: 'megane-signature-turbo',
    name: 'Signature 1.3L Turbo',
    name_ar: 'سيجنتشر 1.3 لتر تيربو EDC',
    parent_business_id: 'biz_model_renault_megane',
    custom_data: {
      sec_listing_price: { official_price_egp: 1450000 },
      sec_auto_specs: { engine_type: '1.3L Turbo TCe 150hp', transmission_type: '7-Speed Dual Clutch EDC', zero_to_100_s: 9.0 }
    }
  },

  // ── 3. Duster Trims ───────────────────────────────────────────
  {
    id: 'biz_trim_duster_authentic',
    slug: 'duster-authentic',
    name: 'Authentic',
    name_ar: 'أوثنتيك (القياسية)',
    parent_business_id: 'biz_model_renault_duster',
    custom_data: {
      sec_listing_price: { official_price_egp: 1195000 },
      sec_auto_specs: { engine_type: '1.2L Turbo Mild-Hybrid', ground_clearance_mm: 217, wheels: '16-inch steel' }
    }
  },
  {
    id: 'biz_trim_duster_evolution',
    slug: 'duster-evolution',
    name: 'Evolution',
    name_ar: 'إيفولوشن (المتوسطة)',
    parent_business_id: 'biz_model_renault_duster',
    custom_data: {
      sec_listing_price: { official_price_egp: 1295000 },
      sec_auto_specs: { engine_type: '1.2L Turbo Mild-Hybrid', infotainment_size_in: 10.1, wheels: '17-inch alloy' }
    }
  },
  {
    id: 'biz_trim_duster_techno',
    slug: 'duster-techno',
    name: 'Techno',
    name_ar: 'تكنو (الفئة الكاملة 4x4)',
    parent_business_id: 'biz_model_renault_duster',
    custom_data: {
      sec_listing_price: { official_price_egp: 1395000 },
      sec_auto_specs: { engine_type: '1.2L Turbo Mild-Hybrid 130hp', camera: 'كاميرات 360 رؤية محيطية', wheels: '18-inch diamond alloy' }
    }
  }
];

const lines = trims.map(t => {
  const cd = JSON.stringify(t.custom_data).replace(/'/g, "''");
  return `INSERT OR REPLACE INTO businesses (id, slug, name, name_ar, type_id, parent_business_id, published, status, minisite_mode, custom_data) VALUES ('${t.id}', '${t.slug}', '${t.name}', '${t.name_ar}', 'vehicle_trim', '${t.parent_business_id}', 1, 'active', 'embedded', '${cd}');`;
});

fs.writeFileSync('scripts/seed_renault_trims.sql', lines.join('\n'), { encoding: 'utf8' });
console.log('Successfully written ' + lines.length + ' Renault trims to scripts/seed_renault_trims.sql');
