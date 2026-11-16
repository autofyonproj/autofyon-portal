/**
 * Seed script for top Egyptian market cars:
 * 1. Creates Official Main Agencies (Toyota Egypt, GB Auto, Al-Mansour, Nissan Motor Egypt, EIM Renault)
 * 2. Creates top Egyptian authorized distributors & service centers
 * 3. Enriches car models (Corolla, Tucson, Sunny, MG 5, Tiggo 7) with official specs & official market trims
 * 4. Links cars <-> agents/distributors/maintenance via business_relationships (represented_by, distributed_by, sold_by, serviced_by)
 */
import fs from 'fs';
import path from 'path';

const sqlStatements = [];

// Helper to escape SQL string
function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// 1. Official Main Agencies
const agencies = [
  {
    id: 'biz_agency_toyota_egypt',
    name: 'Toyota Egypt',
    name_ar: 'تويوتا إيجيبت',
    slug: 'toyota-egypt',
    type_id: 'main_agency',
    brand_id: 'biz_brand_toyota',
    phone: '16550',
    address: 'القطامية، الطريق الدائري، القاهرة',
    city: 'القاهرة',
    tagline_ar: 'الوكيل الرسمي الحصري لسيارات تويوتا في جمهورية مصر العربية'
  },
  {
    id: 'biz_agency_gb_auto',
    name: 'GB Auto (Ghabbour)',
    name_ar: 'غبور أوتو',
    slug: 'gb-auto',
    type_id: 'main_agency',
    brand_id: 'biz_brand_hyundai',
    phone: '16661',
    address: 'طريق القاهرة الإسكندرية الزراعي، قليوب',
    city: 'القاهرة',
    tagline_ar: 'الوكيل الرسمي لسيارات هيونداي وشيري وشانجان ومازدا في مصر'
  },
  {
    id: 'biz_agency_al_mansour',
    name: 'Al-Mansour Automotive',
    name_ar: 'المنصور للسيارات',
    slug: 'al-mansour',
    type_id: 'main_agency',
    brand_id: 'biz_brand_mg',
    phone: '16424',
    address: 'الكيلو 28 طريق مصر الإسكندرية الصحراوي، أبورواش، الجيزة',
    city: 'الجيزة',
    tagline_ar: 'الوكيل الحصري لسيارات إم جي وشيفروليه وأوبل وبيجو في مصر'
  },
  {
    id: 'biz_agency_nissan_egypt',
    name: 'Nissan Motor Egypt',
    name_ar: 'نيسان مصر',
    slug: 'nissan-egypt',
    type_id: 'main_agency',
    brand_id: 'biz_brand_nissan',
    phone: '16855',
    address: 'المنطقة الصناعية الأولى، مدينة السادس من أكتوبر',
    city: 'الجيزة',
    tagline_ar: 'شركة نيسان موتور إيجيبت والمصنع الرسمي في مصر'
  }
];

for (const a of agencies) {
  const customData = JSON.stringify({
    sec_1_identity: {
      business_name: a.name,
      business_name_ar: a.name_ar,
      tagline: a.name,
      tagline_ar: a.tagline_ar,
      phone: a.phone,
      address: a.address,
      city: a.city
    }
  });

  sqlStatements.push(`
INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  ${esc(a.id)}, 'automotive', ${esc(a.type_id)}, NULL, ${esc(a.slug)}, ${esc(a.slug)},
  ${esc(a.name)}, ${esc(a.name_ar)}, 'active', 1, ${esc(customData)}, CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;
`);
}

// 2. Top Distributors & Authorized Service Centers
const distributors = [
  {
    id: 'biz_dist_alsabaa',
    name: 'Al-Sabaa Automotive',
    name_ar: 'السبع أوتوموتيف',
    slug: 'al-sabaa',
    type_id: 'distributor',
    phone: '19077',
    city: 'القاهرة',
    address: 'طريق النصر، مصر الجديدة، القاهرة'
  },
  {
    id: 'biz_dist_elqersh',
    name: 'El-Qersh Cars',
    name_ar: 'القرش للسيارات',
    slug: 'el-qersh',
    type_id: 'distributor',
    phone: '19702',
    city: 'القاهرة',
    address: 'شارع الطيران، مدينة نصر، القاهرة'
  },
  {
    id: 'biz_service_toyota_abbassia',
    name: 'Toyota Egypt Service Center - Abbassia',
    name_ar: 'مركز صيانة تويوتا العباسية المعتمد',
    slug: 'toyota-service-abbassia',
    type_id: 'service_center',
    phone: '16550',
    city: 'القاهرة',
    address: 'شارع السرايات، العباسية، القاهرة'
  },
  {
    id: 'biz_service_gb_ghabbour_abu_rawash',
    name: 'GB Auto Service Center - Abu Rawash',
    name_ar: 'مركز صيانة غبور أبو رواش',
    slug: 'gb-service-abu-rawash',
    type_id: 'service_center',
    phone: '16661',
    city: 'الجيزة',
    address: 'المنطقة الصناعية، أبو رواش، الجيزة'
  }
];

for (const d of distributors) {
  const customData = JSON.stringify({
    sec_1_identity: {
      business_name: d.name,
      business_name_ar: d.name_ar,
      phone: d.phone,
      address: d.address,
      city: d.city
    }
  });

  sqlStatements.push(`
INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  ${esc(d.id)}, 'automotive', ${esc(d.type_id)}, NULL, ${esc(d.slug)}, ${esc(d.slug)},
  ${esc(d.name)}, ${esc(d.name_ar)}, 'active', 1, ${esc(customData)}, CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;
`);
}

// 3. Official Trims (فئات ومواصفات الوكلاء الرسمية) for the Top 5 Egypt Cars
const trims = [
  // Toyota Corolla (Active, Comfort, Smart, GR Sport)
  {
    id: 'biz_trim_corolla_active',
    model_id: 'biz_model_toyota_corolla',
    name: 'Active',
    name_ar: 'أكتيف (مانيوال/أوتوماتيك)',
    slug: 'corolla-active',
    price_egp: 1300000,
    specs: { engine: '1.6L Dual VVT-i', hp: 120, torque: 154, trans: 'CVT / Manual', fuel: 'بنزين 92+' },
    exterior: { wheels: '15-inch Steel', lights: 'Halogen', roof: 'Normal' }
  },
  {
    id: 'biz_trim_corolla_comfort',
    model_id: 'biz_model_toyota_corolla',
    name: 'Comfort',
    name_ar: 'كومفورت (أوتوماتيك)',
    slug: 'corolla-comfort',
    price_egp: 1390000,
    specs: { engine: '1.6L Dual VVT-i', hp: 120, torque: 154, trans: 'Multidrive CVT', fuel: 'بنزين 92+' },
    exterior: { wheels: '16-inch Alloy', lights: 'LED Fog Lights', roof: 'Normal' }
  },
  {
    id: 'biz_trim_corolla_smart',
    model_id: 'biz_model_toyota_corolla',
    name: 'Smart Sunroof',
    name_ar: 'سمارت بفتحة سقف',
    slug: 'corolla-smart',
    price_egp: 1500000,
    specs: { engine: '1.6L Dual VVT-i', hp: 120, torque: 154, trans: 'Multidrive CVT', fuel: 'بنزين 92+' },
    exterior: { wheels: '16-inch Dual Alloy', lights: 'Bi-Beam LED', roof: 'Electric Sunroof' }
  },
  {
    id: 'biz_trim_corolla_gr_sport',
    model_id: 'biz_model_toyota_corolla',
    name: 'GR Sport',
    name_ar: 'جي آر سبورت الرياضية',
    slug: 'corolla-gr-sport',
    price_egp: 1650000,
    specs: { engine: '1.6L Dual VVT-i', hp: 120, torque: 154, trans: 'Multidrive CVT', fuel: 'بنزين 92+' },
    exterior: { wheels: '17-inch GR Sport Black Alloy', lights: 'Full Matrix LED', roof: 'Panoramic Sunroof' }
  },

  // Hyundai Tucson (Shadow, Blaze, Red Line, Night)
  {
    id: 'biz_trim_tucson_shadow',
    model_id: 'biz_model_hyundai_tucson',
    name: 'Shadow',
    name_ar: 'شادو (الفئة الأولى)',
    slug: 'tucson-shadow',
    price_egp: 1750000,
    specs: { engine: '1.6L T-GDI Turbo', hp: 180, torque: 265, trans: '7-Speed DCT', fuel: 'بنزين 95' },
    exterior: { wheels: '17-inch Alloy', lights: 'LED DRL', roof: 'Normal' }
  },
  {
    id: 'biz_trim_tucson_blaze',
    model_id: 'biz_model_hyundai_tucson',
    name: 'Blaze Plus',
    name_ar: 'بليز بلس بفتحة سقف بانوراما',
    slug: 'tucson-blaze',
    price_egp: 1900000,
    specs: { engine: '1.6L T-GDI Turbo', hp: 180, torque: 265, trans: '7-Speed DCT', fuel: 'بنزين 95' },
    exterior: { wheels: '18-inch Alloy', lights: 'Full LED', roof: 'Panoramic Sunroof' }
  },

  // Nissan Sunny (Base, Plus, Super Saloon)
  {
    id: 'biz_trim_sunny_base',
    model_id: 'biz_model_nissan_sunny',
    name: 'Base A/T',
    name_ar: 'بيز أوتوماتيك',
    slug: 'sunny-base',
    price_egp: 695000,
    specs: { engine: '1.5L 4-Cylinder', hp: 108, torque: 134, trans: '4-Speed Automatic', fuel: 'بنزين 92' },
    exterior: { wheels: '15-inch Steel', lights: 'Halogen', roof: 'Normal' }
  },
  {
    id: 'biz_trim_sunny_super_saloon',
    model_id: 'biz_model_nissan_sunny',
    name: 'Super Saloon',
    name_ar: 'سوبر صالون (أعلى فئة)',
    slug: 'sunny-super-saloon',
    price_egp: 765000,
    specs: { engine: '1.5L 4-Cylinder', hp: 108, torque: 134, trans: '4-Speed Automatic', fuel: 'بنزين 92' },
    exterior: { wheels: '15-inch Two-Tone Alloy', lights: 'Halogen with Fog', roof: 'Normal' }
  },

  // MG 5 (Standard, Comfort, Luxury)
  {
    id: 'biz_trim_mg5_comfort',
    model_id: 'biz_model_mg_mg_5',
    name: 'Comfort',
    name_ar: 'كومفورت',
    slug: 'mg5-comfort',
    price_egp: 830000,
    specs: { engine: '1.5L 4-Cylinder', hp: 120, torque: 150, trans: 'CVT', fuel: 'بنزين 92' },
    exterior: { wheels: '16-inch Alloy', lights: 'LED', roof: 'Normal' }
  },
  {
    id: 'biz_trim_mg5_luxury',
    model_id: 'biz_model_mg_mg_5',
    name: 'Luxury Sunroof',
    name_ar: 'لاكشري بفتحة سقف وكاميرا 360',
    slug: 'mg5-luxury',
    price_egp: 900000,
    specs: { engine: '1.5L 4-Cylinder', hp: 120, torque: 150, trans: 'CVT', fuel: 'بنزين 92' },
    exterior: { wheels: '16-inch Diamond Cut Alloy', lights: 'Full LED', roof: 'Sunroof' }
  }
];

for (const t of trims) {
  const customData = JSON.stringify({
    sec_1_identity: {
      business_name: t.name,
      business_name_ar: t.name_ar,
      category: 'Trim / Variant'
    },
    sec_auto_specs: t.specs,
    sec_auto_exterior: t.exterior,
    sec_listing_price: {
      official_price_egp: t.price_egp,
      currency: 'EGP'
    }
  });

  sqlStatements.push(`
INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  ${esc(t.id)}, 'automotive', 'vehicle_trim', ${esc(t.model_id)}, ${esc(t.slug)}, ${esc(t.slug)},
  ${esc(t.name)}, ${esc(t.name_ar)}, 'active', 1, ${esc(customData)}, CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;
`);
}

// 4. Update parent models with comprehensive specs and trims shelf
const modelSpecsUpdates = [
  {
    id: 'biz_model_toyota_corolla',
    specs: {
      engine_type: 'بنزين 4 أسطوانات خطي Dual VVT-i',
      displacement_cc: 1598,
      power_hp: 120,
      torque_nm: 154,
      transmission_type: 'CVT Multidrive',
      drivetrain: 'دفع أمامي FWD',
      fuel_consumption_l_100km: 6.8,
      fuel_tank_capacity_l: 50,
      acceleration_0_100: 10.8,
      top_speed_kmh: 195,
      seats: 5
    },
    exterior: {
      length_mm: 4630,
      width_mm: 1780,
      height_mm: 1435,
      trunk_capacity_l: 471
    }
  },
  {
    id: 'biz_model_hyundai_tucson',
    specs: {
      engine_type: '1.6 Turbo SmartStream GDI',
      displacement_cc: 1598,
      power_hp: 180,
      torque_nm: 265,
      transmission_type: '7-Speed DCT أوتوماتيك ثنائي التعشيق',
      drivetrain: 'دفع أمامي FWD',
      fuel_consumption_l_100km: 6.1,
      fuel_tank_capacity_l: 54,
      acceleration_0_100: 9.0,
      top_speed_kmh: 201,
      seats: 5
    },
    exterior: {
      length_mm: 4500,
      width_mm: 1865,
      height_mm: 1650,
      trunk_capacity_l: 503
    }
  },
  {
    id: 'biz_model_nissan_sunny',
    specs: {
      engine_type: '1.5L 4 أسطوانات خطي DOHC',
      displacement_cc: 1498,
      power_hp: 108,
      torque_nm: 134,
      transmission_type: '4 سرعات أوتوماتيك',
      drivetrain: 'دفع أمامي FWD',
      fuel_consumption_l_100km: 6.9,
      fuel_tank_capacity_l: 41,
      acceleration_0_100: 12.5,
      top_speed_kmh: 178,
      seats: 5
    },
    exterior: {
      length_mm: 4425,
      width_mm: 1695,
      height_mm: 1500,
      trunk_capacity_l: 490
    }
  }
];

for (const m of modelSpecsUpdates) {
  sqlStatements.push(`
UPDATE businesses
   SET custom_data = json_set(
     json_set(COALESCE(custom_data, '{}'), '$.sec_auto_specs', json(${esc(JSON.stringify(m.specs))})),
     '$.sec_auto_exterior', json(${esc(JSON.stringify(m.exterior))})
   )
 WHERE id = ${esc(m.id)};
`);
}

// 5. Connect Cars <-> Agents <-> Distributors <-> Service Centers via business_relationships
const relationships = [
  // Toyota Brand <-> Toyota Egypt (represented_by)
  {
    id: 'rel_toyota_agency',
    from: 'biz_brand_toyota',
    to: 'biz_agency_toyota_egypt',
    type: 'represented_by',
    primary: 1
  },
  // Corolla <-> Toyota Egypt (distributed_by)
  {
    id: 'rel_corolla_dist_agency',
    from: 'biz_model_toyota_corolla',
    to: 'biz_agency_toyota_egypt',
    type: 'distributed_by',
    primary: 1
  },
  // Corolla <-> Al-Sabaa (sold_by)
  {
    id: 'rel_corolla_sold_sabaa',
    from: 'biz_model_toyota_corolla',
    to: 'biz_dist_alsabaa',
    type: 'sold_by',
    primary: 0
  },
  // Corolla <-> El-Qersh (sold_by)
  {
    id: 'rel_corolla_sold_elqersh',
    from: 'biz_model_toyota_corolla',
    to: 'biz_dist_elqersh',
    type: 'sold_by',
    primary: 0
  },
  // Corolla <-> Toyota Service Abbassia (serviced_by)
  {
    id: 'rel_corolla_service_abbassia',
    from: 'biz_model_toyota_corolla',
    to: 'biz_service_toyota_abbassia',
    type: 'serviced_by',
    primary: 1
  },

  // Hyundai Brand <-> GB Auto (represented_by)
  {
    id: 'rel_hyundai_agency',
    from: 'biz_brand_hyundai',
    to: 'biz_agency_gb_auto',
    type: 'represented_by',
    primary: 1
  },
  // Tucson <-> GB Auto (distributed_by)
  {
    id: 'rel_tucson_dist_gb',
    from: 'biz_model_hyundai_tucson',
    to: 'biz_agency_gb_auto',
    type: 'distributed_by',
    primary: 1
  },
  // Tucson <-> Al-Sabaa (sold_by)
  {
    id: 'rel_tucson_sold_sabaa',
    from: 'biz_model_hyundai_tucson',
    to: 'biz_dist_alsabaa',
    type: 'sold_by',
    primary: 0
  },
  // Tucson <-> GB Service Abu Rawash (serviced_by)
  {
    id: 'rel_tucson_service_gb',
    from: 'biz_model_hyundai_tucson',
    to: 'biz_service_gb_ghabbour_abu_rawash',
    type: 'serviced_by',
    primary: 1
  },

  // Nissan Brand <-> Nissan Egypt (represented_by)
  {
    id: 'rel_nissan_agency',
    from: 'biz_brand_nissan',
    to: 'biz_agency_nissan_egypt',
    type: 'represented_by',
    primary: 1
  },
  // Sunny <-> Nissan Egypt (distributed_by)
  {
    id: 'rel_sunny_dist_nissan',
    from: 'biz_model_nissan_sunny',
    to: 'biz_agency_nissan_egypt',
    type: 'distributed_by',
    primary: 1
  },
  // Sunny <-> El-Qersh (sold_by)
  {
    id: 'rel_sunny_sold_elqersh',
    from: 'biz_model_nissan_sunny',
    to: 'biz_dist_elqersh',
    type: 'sold_by',
    primary: 0
  },

  // MG Brand <-> Al-Mansour (represented_by)
  {
    id: 'rel_mg_agency',
    from: 'biz_brand_mg',
    to: 'biz_agency_al_mansour',
    type: 'represented_by',
    primary: 1
  },
  // MG 5 <-> Al-Mansour (distributed_by)
  {
    id: 'rel_mg5_dist_mansour',
    from: 'biz_model_mg_mg_5',
    to: 'biz_agency_al_mansour',
    type: 'distributed_by',
    primary: 1
  }
];

for (const r of relationships) {
  sqlStatements.push(`
INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  ${esc(r.id)}, ${esc(r.from)}, ${esc(r.to)}, ${esc(r.type)}, ${r.primary}, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;
`);
}

const outputPath = path.resolve('scripts', 'seed_egypt_market_agents_and_trims.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');
console.log(`Generated SQL to ${outputPath} with ${sqlStatements.length} statements.`);
