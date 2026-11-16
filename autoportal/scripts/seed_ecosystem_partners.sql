-- =========================================================================
-- SEED STRATEGIC ADVISORY PARTNERS (DEMO ECOSYSTEM MINISITES)
-- Sectors: Banking/Auto-Finance, Oil/Lubricants, Telecom, Insurance
-- =========================================================================

-- 1. BANQUE MISR (Auto Finance)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_partner_banque_misr',
  'Banque Misr Auto Finance',
  'بنك مصر - تمويل السيارات',
  'banque-misr',
  'finance_bank',
  'automotive',
  NULL,
  '/banque-misr',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Banque Misr Auto Finance",
      "business_name_ar": "بنك مصر - تمويل وتقسيط السيارات",
      "category": "Auto Finance & Loans",
      "tagline_ar": "شريكك المالي لشراء سيارة أحلامك بأسهل إجراءات في مصر",
      "description_ar": "يقدم بنك مصر باقة متكاملة من قروض وتمويل السيارات الجديدة للموظفين وأصحاب المهن الحرة وأصحاب الأعمال، بفترات سداد مرنة تصل إلى 84 شهراً، وتمويل يصل إلى 100% من قيمة السيارة، مع سرعة الموافقة الائتمانية."
    },
    "sec_auto_specs": {
      "loan_duration_months": 84,
      "down_payment_min_pct": 0,
      "max_loan_amount_egp": 6000000,
      "approval_time_hours": 24,
      "requirements_ar": "بطاقة رقم قومي سارية، إثبات دخل أو كشف حساب بنكي لـ 6 أشهر، وعرض سعر معتمد من المعرض."
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- 2. MOBIL 1 EGYPT (Engine Lubricants)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_partner_mobil1',
  'Mobil 1 Egypt',
  'موبيل 1 مصر',
  'mobil-1',
  'accessories_detailing',
  'automotive',
  NULL,
  '/mobil-1',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Mobil 1 Egypt",
      "business_name_ar": "موبيل 1 - الحماية الفائقة للمحركات",
      "category": "Engine Oils & Lubricants",
      "tagline_ar": "الزيت التخليقي رقم 1 الموصى به لكبرى محركات العالم",
      "description_ar": "زيوت موبيل 1 التخليقية بالكامل توفر حماية استثنائية ضد التآكل في درجات الحرارة المرتفعة، وتحافظ على كفاءة محركات التيربو والهايبرد الحديثة، وتوصي بها كبرى شركات السيارات العالمية والوكلاء الرسميون لضمان سلامة المحرك."
    },
    "sec_auto_specs": {
      "recommended_viscosity": "0W-20 / 5W-30 Synthetic",
      "service_interval_km": 10000,
      "turbo_protection": 1,
      "certification_ar": "معتمد ومطابق لمواصفات API SP و ILSAC GF-6A وأحدث معايير المصنعين."
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- 3. VODAFONE RED (Connected Car & eSIM)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_partner_vodafone',
  'Vodafone RED Connected Car',
  'فودافون مصر - تكنولوجيا السيارات المتصلة',
  'vodafone',
  'accessories_detailing',
  'automotive',
  NULL,
  '/vodafone',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Vodafone RED Connected Car",
      "business_name_ar": "فودافون مصر - إنترنت وتقنيات السيارات الذكية",
      "category": "Connected Car & Telematics",
      "tagline_ar": "أسرع شبكة إنترنت لشاشات سيارتك وخدمات الملاحة الذكية",
      "description_ar": "تقدم فودافون مصر حلول إنترنت السيارات المتصلة عبر شرائح eSIM المدمجة وباقات بيانات مخصصة لأنظمة الملاحة، وتحديثات الخرائط المباشرة، وبث الموسيقى والشاشات الترفيهية في أحدث طرازات السيارات."
    },
    "sec_auto_specs": {
      "network_type": "4G / 5G Ready",
      "esim_support": 1,
      "hotspot_support": 1,
      "features_ar": "اتصال فوري للشاشة، تحديثات حية لحركة المرور، وبث غير محدود للمحتوى الصوتي."
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- 4. MISR INSURANCE (Comprehensive Auto Insurance)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_partner_misr_insurance',
  'Misr Insurance',
  'شركة مصر للتأمين',
  'misr-insurance',
  'insurance_company',
  'automotive',
  NULL,
  '/misr-insurance',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Misr Insurance",
      "business_name_ar": "شركة مصر للتأمين - التأمين الشامل للسيارات",
      "category": "Motor Insurance",
      "tagline_ar": "أعرق وأكبر شركة تأمين في مصر لحماية استثمارك في سيارتك",
      "description_ar": "تغطية تأمينية شاملة ومتكاملة تحميك من مخاطر حوادث الطرق، والسرقة، والحريق، والتلفيات الكلية والجزئية، مع شبكة إصلاح معتمدة لدى التوكيلات الرسمية وكبرى مراكز الخدمة في كافة أنحاء الجمهورية."
    },
    "sec_auto_specs": {
      "coverage_type": "تأمين شامل ضد كافة الأخطار",
      "authorized_agency_repairs": 1,
      "roadside_assistance": 1,
      "claim_processing_days": 3
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;
