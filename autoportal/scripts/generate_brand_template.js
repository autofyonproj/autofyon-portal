const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const wb = XLSX.utils.book_new();

// -------------------------------------------------------------
// Sheet 1: AI Agent SOP & Coding Instructions (تعليمات_الوكيل_الكودي)
// -------------------------------------------------------------
const sheet1Data = [
  ['دليل وتعليمات وكيل الذكاء الاصطناعي (AI Agent Prompt & Ingestion SOP) — AutoFyon', '', ''],
  ['الهدف:', 'تعبئة وتحديث قاعدة بيانات سيارات السوق المصري بدقة رسمية 100% مع ربط صور المواصفات للكاروسيل ومقارنة الخليج', ''],
  ['', '', ''],
  ['م', 'المحور / التعليمات', 'التفاصيل والمعايير الإلزامية'],
  ['1', 'مصادر البيانات الإلزامية', 'الاعتماد حصراً على: 1) البروشور الرسمي للوكيل المصري (PDF)، 2) موقع الوكيل الرسمي المحلي، 3) صفحات الوكيل في الخليج (mg-me, toyota.com.sa, etc). يُمنع النقل الأعمى من المنتديات غير الموثقة.'],
  ['2', 'صور الكاروسيل لكل مواصفة (Spec-Bound Images)', 'الكاروسيل في AutoFyon لا يعرض مجرد صور عشوائية، بل يعرض "صورة لكل بند مواصفة":\n- الواجهة/الهيكل (sec_auto_exterior)\n- المقصورة/الشاشات/الفرش (sec_auto_interior)\n- المحرك/التوربو/البطارية (sec_auto_engine)\n- أنظمة الأمان/الرادار/الوسائد (sec_auto_safety)\n- التكنولوجيا/الشاحن/HUD (sec_auto_technology)\nيجب إدراج رابط صورة مباشر من موقع الوكيل أو CDN معتمد.'],
  ['3', 'منع تضارب الصور (Zero Image Conflicts)', 'يُحظر منعاً باتاً استخدام صور عامة (Unsplash, Stock, Placeholder) أو استخدام نفس الصورة لأكثر من موديل مختلف. كل صورة يجب أن تكون خاصة بالموديل والفئة بدقة.'],
  ['4', 'رابط البروشور الرسمي (Official PDF Brochure)', 'يجب استخراج رابط ملف الـ PDF الرسمي للموديل لوضعه في خانة brochure_url، حيث يتيح الموقع تحميله فوراً للعملاء عبر /api/cars/[slug]/brochure.'],
  ['5', 'مقارنة الخليج (GCC Comparison)', 'يجب توضيح الفروقات الجوهرية بين نسخة مصر والخليج (مثل سعة المحرك 1.5T بمصر لتفادي جمارك 1600cc مقابل 2.0T بالخليج، وتوافر التبريد الاستوائي GCC والعزل).'],
  ['6', 'تحديث شبكة الموزعين ومراكز الخدمة', 'حصر كافة صالات العرض المعتمدة، مراكز الصيانة، مصانع التجميع المحلي مع أرقام الهواتف والعناوين والخط الساخن الموحد.'],
  ['7', 'مقارنة القيم الحالية (Diff & Audit)', 'مقارنة الأسعار والمواصفات السابقة بالجديدة ورصد أي تغيرات (مثل زيادة السعر أو تعديل التجهيز القياسي).']
];
const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);

// -------------------------------------------------------------
// Sheet 2: Brand & Agency Profile (بيانات_العلامة_والوكيل)
// -------------------------------------------------------------
const sheet2Data = [
  ['بيانات العلامة التجارية والوكيل الرسمي في مصر', '', '', '', '', '', '', '', '', ''],
  ['تاريخ التحديث:', '2026-11-22', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  [
    'اسم العلامة (EN)', 'اسم العلامة (AR)', 'المعرّف الكودي (Slug)', 'بلد المنشأ', 'سنة التأسيس',
    'اسم الوكيل الرسمي (EN)', 'اسم الوكيل الرسمي (AR)', 'معرّف الوكيل (Slug)', 'الخط الساخن',
    'الموقع الرسمي للوكيل', 'البريد الإلكتروني للوكيل', 'عنوان المقر الرئيسي'
  ],
  [
    'Toyota', 'تويوتا', 'toyota', 'Japan (اليابان)', '1937',
    'Toyota Egypt', 'تويوتا إيجيبت', 'toyota-egypt', '16550',
    'https://www.toyota.com.eg', 'customercare@toyota.com.eg', 'طريق مصر إسكندرية الصحراوي، أبو رواش، الجيزة'
  ],
  [
    'MG', 'إم جي', 'mg', 'United Kingdom (بريطانيا)', '1924',
    'Mansour Automotive - MG', 'المنصور للسيارات - إم جي', 'mansour-automotive-mg', '16424',
    'https://www.mgmotor.com.eg', 'info@mgmotor.com.eg', 'الطريق الدائري، منطقة المعارض، القاهرة الجديدة'
  ],
  [
    'BMW', 'بي إم دبليو', 'bmw', 'Germany (ألمانيا)', '1916',
    'Global Auto', 'جلوبال أوتو', 'global-auto-bmw-egypt', '19269',
    'https://www.bmw-egypt.com', 'customercare@bmw-egypt.com', 'القطامية، الطريق الدائري، القاهرة'
  ]
];
const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);

// -------------------------------------------------------------
// Sheet 3: Showrooms & Service Centers (الفروع_ومراكز_الخدمة)
// -------------------------------------------------------------
const sheet3Data = [
  ['دليل فروع وصالات العرض ومراكز الصيانة ومصانع التجميع', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  [
    'كود الفرع (Slug)', 'الوكيل / العلامة', 'اسم الفرع / المركز', 'النوع (showroom / service_center / factory)',
    'المدينة', 'المحافظة', 'العنوان التفصيلي', 'الهاتف / الخط الساخن', 'الخدمات المتاحة', 'حالة العمل'
  ],
  [
    'toyota-aburawash', 'Toyota Egypt', 'مركز أبو رواش الرئيسي', 'service_center',
    'أبو رواش', 'الجيزة', 'الكيلو 28 طريق مصر إسكندرية الصحراوي', '16550', 'مبيعات + صيانة سريعة + قطع غيار + سمكرة ودهان', 'نشط'
  ],
  [
    'toyota-cfc', 'Toyota Egypt', 'معرض كايرو فيستيفال سيتي', 'showroom',
    'التجمع الخامس', 'القاهرة', 'كايرو فيستيفال سيتي مول، القاهرة الجديدة', '16550', 'معرض مبيعات واستلام سيارات جديدة', 'نشط'
  ],
  [
    'mg-dokki', 'Mansour Automotive', 'معرض الدقي', 'showroom',
    'الدقي', 'الجيزة', 'شارع التحرير، الدقي', '16424', 'مبيعات وعرض الطرازات', 'نشط'
  ],
  [
    'mg-smouha', 'Mansour Automotive', 'فرع سموحة (الإسكندرية)', 'showroom',
    'سموحة', 'الإسكندرية', '90 شارع فوزي معاذ، سموحة', '16424', 'مبيعات + مركز صيانة معتمد', 'نشط'
  ],
  [
    'bmw-service-abu-rawash', 'Global Auto', 'مركز خدمة BMW أبو رواش', 'service_center',
    'أبو رواش', 'الجيزة', 'المنطقة 31، طريق أبو رواش الصناعي', '19269', 'صيانة دورية + ضمان رسمي + قطع غيار أصلية', 'نشط'
  ],
  [
    'bmw-assembly-6october', 'Global Auto', 'مصنع تجميع BMW السادس من أكتوبر', 'factory',
    'السادس من أكتوبر', 'الجيزة', 'المنطقة الصناعية، 6 أكتوبر', '19269', 'تجميع محلي لطرازات X5 وX3 و3 Series', 'نشط'
  ]
];
const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);

// -------------------------------------------------------------
// Sheet 4: Models, Trims & Official Prices (الموديلات_والفئات_والأسعار)
// -------------------------------------------------------------
const sheet4Data = [
  ['قائمة الموديلات والفئات والأسعار الرسمية في مصر (EGP)', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  [
    'الماركة', 'اسم الموديل (EN)', 'اسم الموديل (AR)', 'كود الموديل (Slug)', 'سنة الصنع',
    'نوع الهيكل', 'رابط البروشور الرسمي (PDF URL)', 'اسم الفئة (Trim EN)', 'اسم الفئة (Trim AR)',
    'كود الفئة (Trim Slug)', 'السعر الرسمي (جنيه)', 'ملاحظات التسعير والزيادة', 'شروط الضمان'
  ],
  [
    'Toyota', 'Toyota Corolla', 'تويوتا كورولا', 'corolla', '2026',
    'Sedan', 'https://www.toyota.com.eg/vehicles/corolla', 'Active AT', 'أكتيف أوتوماتيك',
    'corolla-active', 1280000, 'الفئة القياسية الأولى', '5 سنوات أو 150,000 كم'
  ],
  [
    'Toyota', 'Toyota Corolla', 'تويوتا كورولا', 'corolla', '2026',
    'Sedan', 'https://www.toyota.com.eg/vehicles/corolla', 'Comfort AT', 'كومفورت أوتوماتيك',
    'corolla-comfort', 1380000, 'زيادة 100 ألف ج: جنوط ألومنيوم 16 وتكييف أوتو ثنائي', '5 سنوات أو 150,000 كم'
  ],
  [
    'Toyota', 'Toyota Corolla', 'تويوتا كورولا', 'corolla', '2026',
    'Sedan', 'https://www.toyota.com.eg/vehicles/corolla', 'Elegance AT', 'إليجانس أوتوماتيك',
    'corolla-elegance', 1630000, 'الفئة الأعلى تجهيزاً: جنوط 17، جلد، Bi-LED، شاحن لاسلكي', '5 سنوات أو 150,000 كم'
  ],
  [
    'Toyota', 'Toyota Fortuner', 'تويوتا فورتشنر', 'fortuner', '2026',
    'SUV (7-Seats)', 'https://www.toyota.com.eg/vehicles/fortuner', 'Smart 2.7L 2WD', 'سمارت 2.7 لتر دفع خلفي',
    'fortuner-smart-2026', 3250000, 'تجميع محلي بالهيئة العربية للتصنيع AAV', '5 سنوات أو 150,000 كم'
  ],
  [
    'Toyota', 'Toyota Fortuner', 'تويوتا فورتشنر', 'fortuner', '2026',
    'SUV (7-Seats)', 'https://www.toyota.com.eg/vehicles/fortuner', 'Sport 4.0L V6 4WD', 'سبورت 4.0 لتر V6 دفع رباعي',
    'fortuner-sport-2026', 3700000, 'أعلى فئة V6: نظام دفع رباعي كامل + صوت JBL + 7 وسائد', '5 سنوات أو 150,000 كم'
  ],
  [
    'MG', 'MG 7', 'إم جي 7', 'mg-7', '2027',
    'Luxury Fastback', 'https://www.mgmotor.com.eg/model/mg7/', 'Luxury 1.5T', 'لاكشري 1.5 تيربو',
    'mg-7-luxury', 1625000, 'محرك 1.5 تيربو بقوة 185 حصان مع أبواب بدون إطار', '6 سنوات أو 150,000 كم'
  ],
  [
    'MG', 'MG 7', 'إم جي 7', 'mg-7', '2027',
    'Luxury Fastback', 'https://www.mgmotor.com.eg/model/mg7/', 'Trophy 1.5T', 'تروفي 1.5 تيربو',
    'mg-7-trophy', 1750000, 'زيادة 125 ألف: جناح نشط كهربائي + صوت Bose 14 سماعة + E-LSD', '6 سنوات أو 150,000 كم'
  ]
];
const ws4 = XLSX.utils.aoa_to_sheet(sheet4Data);

// -------------------------------------------------------------
// Sheet 5: Technical Specs for Carousel Note & Shelves (المواصفات_الفنية_للكاروسيل)
// -------------------------------------------------------------
const sheet5Data = [
  ['المواصفات الفنية التفصيلية لكل فئة (تغذي شريط ملخص الكاروسيل والجداول)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  [
    'كود الفئة (Trim Slug)', 'نوع المحرك وسعته (Engine)', 'السعة بالسي سي (cc)', 'الأسطوانات/الصمامات',
    'القوة بالحصان (HP)', 'العزم (Nm @ RPM)', 'التسارع 0-100 كم/س (ثواني)', 'السرعة القصوى (كم/س)',
    'ناقل الحركة (Transmission)', 'نوع الدفع (FWD/RWD/AWD)', 'استهلاك الوقود (لتر/100كم)',
    'الأبعاد (طول×عرض×ارتفاع مم)', 'قاعدة العجلات (مم)', 'الخلوص الأرضي (مم)', 'سعة الشنطة (لتر)',
    'سعة خزان الوقود (لتر)', 'مقاس ونوع الجنوط', 'عدد المقاعد'
  ],
  [
    'corolla-active', '1.6L 4-Cyl Dual VVT-i', 1598, '4 / 16',
    120, '154 @ 5200', 11.0, 190,
    'CVT 10-Speed Simulated', 'دفع أمامي FWD', 6.2,
    '4630 x 1780 x 1435', 2700, 135, 471,
    50, '15-inch Steel (195/65 R15)', 5
  ],
  [
    'corolla-elegance', '1.6L 4-Cyl Dual VVT-i', 1598, '4 / 16',
    120, '154 @ 5200', 11.0, 190,
    'CVT 10-Speed Simulated', 'دفع أمامي FWD', 6.2,
    '4630 x 1780 x 1435', 2700, 135, 471,
    50, '17-inch Alloy (225/45 R17)', 5
  ],
  [
    'fortuner-sport-2026', '4.0L V6 DOHC (1GR-FE)', 3956, '6 / 24',
    234, '376 @ 3800', 9.0, 187,
    '6-Speed Automatic', 'دفع رباعي 4WD with Diff-Lock', 12.0,
    '4795 x 1855 x 1835', 2745, 225, '200 - 1080',
    80, '18-inch Sport Alloy (265/60 R18)', 7
  ],
  [
    'mg-7-trophy', '1.5L Turbocharged Direct Injection', 1496, '4 / 16',
    185, '300 @ 1500-4000', 7.9, 210,
    '7-Speed Wet DCT Automatic', 'دفع أمامي FWD with E-LSD', 6.5,
    '4884 x 1889 x 1447', 2778, 140, 375,
    65, '19-inch Trophy Alloy (245/40 R19)', 5
  ]
];
const ws5 = XLSX.utils.aoa_to_sheet(sheet5Data);

// -------------------------------------------------------------
// Sheet 6: Spec-Bound Images for Carousel (صور_المواصفات_للكاروسيل)
// -------------------------------------------------------------
const sheet6Data = [
  ['دليل ربط الصور بالمواصفات وأقسام الكاروسيل (Spec-Bound Gallery)', '', '', '', '', '', '', '', ''],
  ['قاعدة حاسمة:', 'يُمنع استخدام أي صور مجهولة أو مكررة. يجب أن توضح الصورة مواصفة محددة وتُربط بالقسم الصحيح.', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  [
    'كود الموديل (Model Slug)', 'قسم الكاروسيل (Section ID)', 'مواصفة الصورة (Bound Feature / Spec)',
    'رابط الصورة المباشر (Official Image URL)', 'معرف الأصل (Asset ID)', 'التعليق بالإنجليزية (Caption EN)',
    'التعليق بالعربية (Caption AR)', 'دور الصورة (hero / carousel / shelf)', 'حالة التحقق'
  ],
  [
    'corolla', 'sec_1_identity', 'Main Exterior Studio Cutout',
    'https://www.toyota.com.eg/media/corolla_ext_front.png', 'COROLLA_HERO_01', 'Toyota Corolla — Exterior Front View',
    'تويوتا كورولا — المظهر الأمامي الرسمي', 'hero', 'معتمد رسمياً'
  ],
  [
    'corolla', 'sec_auto_interior', '12.3-inch Digital Meter Cluster & Touchscreen',
    'https://www.toyota.com.eg/media/corolla_int_dash.png', 'COROLLA_INT_01', '12.3-inch Digital Cockpit & Infotainment',
    'شاشة العدادات الرقمية 12.3 بوصة وشاشة الترفيه', 'carousel', 'معتمد رسمياً'
  ],
  [
    'mg-7', 'sec_1_identity', 'Fastback Exterior Profile with Frameless Doors',
    'https://www.mgmotor.com.eg/media/1887/mg7_ext_spoiler.jpg', 'MG7_EXT_01', 'MG 7 — Active Aero Spoiler & Frameless Doors',
    'إم جي 7 — الجناح الخلفي النشط والأبواب بدون إطار', 'hero', 'معتمد رسمياً'
  ],
  [
    'mg-7', 'sec_auto_technology', '14-Speaker Bose Premium Sound System',
    'https://www.mgmotor.com.eg/media/1888/mg7_bose_audio.jpg', 'MG7_TECH_01', 'Bose 14-Speaker Premium Sound System',
    'نظام صوتي فاخر Bose بـ 14 سماعة مع مضخم صوت', 'carousel', 'معتمد رسمياً'
  ],
  [
    'fortuner', 'sec_auto_engine', '4.0L V6 1GR-FE Engine & 4WD Transfer Case',
    'https://www.toyota.com.eg/media/fortuner_engine_v6.png', 'FORTUNER_ENG_01', '4.0L V6 Dual VVT-i 234 HP Engine',
    'محرك V6 سعة 4.0 لتر بقوة 234 حصان مع ناقل حركة دفع رباعي', 'carousel', 'معتمد رسمياً'
  ]
];
const ws6 = XLSX.utils.aoa_to_sheet(sheet6Data);

// -------------------------------------------------------------
// Sheet 7: Egypt vs GCC Regional Comparison (مقارنة_مواصفات_الخليج)
// -------------------------------------------------------------
const sheet7Data = [
  ['مقارنة مواصفات الوكيل المصري مقابل مواصفات الخليج (GCC) والتبريد الاستوائي والجمارك', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  [
    'الموديل', 'بند المقارنة (Attribute EN)', 'بند المقارنة (Attribute AR)',
    'مواصفة الوكيل المصري (Egypt Spec)', 'مواصفة الخليج (GCC Spec - UAE/KSA)',
    'سنة موديل الخليج', 'حالة المطابقة (identical / market_divergence)',
    'السبب الفني أو الجمركي (Technical/Customs Justification)', 'رابط مصدر الخليج'
  ],
  [
    'MG 7', 'Engine & Transmission', 'المحرك وناقل الحركة',
    '1.5 لتر تيربو (185 حصان / 300 ن.م / 7 DCT)', '2.0 لتر تيربو (261 حصان / 405 ن.م / ZF 9 أوتوماتيك)',
    2027, 'market_divergence',
    'مصر تعتمد محرك 1.5T لتجنب شريحة الجمارك المرتفعة لما فوق 1600 سي سي، بينما تتوفر نسخة 2.0T الأقوى في الخليج',
    'https://www.mg-me.com/new-cars/mg7/'
  ],
  [
    'MG ZS', 'Generation & Gearbox', 'الجيل وناقل الحركة',
    'الجيل الحالي: 1.5 لتر (119 حصان) + أوتوماتيك 4 سرعات اعتيادي', 'الجيل الجديد كلياً: 1.5 لتر (110 حصان) + ناقل CVT وشاشة 12.3',
    2027, 'market_divergence',
    'طرح الجيل الجديد في أسواق الخليج مبكراً بينما يستمر الجيل المجرّب بمصر لسهولة الصيانة وتوافر القطع',
    'https://www.mg-me.com/new-cars/mg-zs/'
  ],
  [
    'كافة الطرازات', 'Cooling & Air Filtration', 'منظومة التبريد والتكييف',
    'مواصفات تبريد قياسية مع معايرة للبنزين المحلي (92/95)', 'حزمة تبريد استوائي GCC (ردياتير مضاعف + كمبروسر تكييف استوائي 50+ درجة)',
    2027, 'market_divergence',
    'مطابقة اشتراطات هيئة التقييس الخليجية GSO لمقاومة درجات الحرارة الاستوائية الشديدة',
    'https://www.mg-me.com'
  ]
];
const ws7 = XLSX.utils.aoa_to_sheet(sheet7Data);

// -------------------------------------------------------------
// Sheet 8: Current DB Diff & Audit Log (سجل_التدقيق_ومطابقة_الحالي)
// -------------------------------------------------------------
const sheet8Data = [
  ['سجل التدقيق ومقارنة البيانات المستخلصة مع قاعدة بيانات AutoFyon الحالية', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  [
    'الموديل / البند', 'البيان في قاعدة البيانات الحالية', 'البيان المستخلص الجديد',
    'الحالة (مطابق / تغير سعر / تحديث مواصفة)', 'تاريخ التدقيق', 'مصدر التحقق', 'الإجراء المتخذ برمجياً', 'ملاحظات المدقق'
  ],
  [
    'Toyota Corolla Active', '1,200,000 ج.م', '1,280,000 ج.م',
    'تغير سعر رسمي (+80k)', '2026-11-22', 'قائمة أسعار تويوتا إيجيبت الرسمية', 'تحديث السعر في custom_data.sec_listing_price', 'تحديث معتمد من الوكيل'
  ],
  [
    'MG 7 Trophy 1.5T', 'غير مسجل سابقاً', '1,750,000 ج.م (جناح نشط + صوت Bose)',
    'إضافة موديل وفئة جديدة', '2026-11-22', 'بروشور المنصور إم جي 2027', 'إنشاء صفحة الموديل والفئات وسحب الصور المعتمدة', 'طراز جديد فلاجشيب'
  ]
];
const ws8 = XLSX.utils.aoa_to_sheet(sheet8Data);

// Add sheets to workbook
XLSX.utils.book_append_sheet(wb, ws1, 'تعليمات_الوكيل_الكودي');
XLSX.utils.book_append_sheet(wb, ws2, 'بيانات_العلامة_والوكيل');
XLSX.utils.book_append_sheet(wb, ws3, 'الفروع_ومراكز_الخدمة');
XLSX.utils.book_append_sheet(wb, ws4, 'الموديلات_والفئات_والأسعار');
XLSX.utils.book_append_sheet(wb, ws5, 'المواصفات_الفنية_للكاروسيل');
XLSX.utils.book_append_sheet(wb, ws6, 'صور_المواصفات_للكاروسيل');
XLSX.utils.book_append_sheet(wb, ws7, 'مقارنة_مواصفات_الخليج');
XLSX.utils.book_append_sheet(wb, ws8, 'سجل_التدقيق_ومطابقة_الحالي');

// Target paths
const publicTemplatesDir = path.resolve('e:/autofyon fof VSCode/autoportal/public/templates');
if (!fs.existsSync(publicTemplatesDir)) {
  fs.mkdirSync(publicTemplatesDir, { recursive: true });
}

const targetPath = path.join(publicTemplatesDir, 'AutoFyon_Standard_Car_Brand_Data_Template.xlsx');
XLSX.writeFile(wb, targetPath);
console.log('Successfully created master template at:', targetPath);

// Also copy to brain artifact dir for the user
const artifactPath = 'C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/AutoFyon_Standard_Car_Brand_Data_Template.xlsx';
fs.copyFileSync(targetPath, artifactPath);
console.log('Successfully copied to artifact directory at:', artifactPath);
