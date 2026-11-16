/**
 * seed-automotive-catalog.js
 * 
 * Comprehensive Automotive Catalog for AutoFyon / Egyptian Market
 * Seeds 30 major automotive brands and 150+ vehicle models into Cloudflare D1.
 * 
 * Invariants:
 *  - businesses.type_id = 'vehicle_brand' for makes
 *  - businesses.type_id = 'vehicle_model' for cars (parent_business_id = brand.id)
 *  - site_profiles.logo_url for official brand logos
 *  - Idempotent (INSERT OR REPLACE / ON CONFLICT)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized';

const CATALOG = [
  {
    name: 'Toyota',
    nameAr: 'تويوتا',
    slug: 'toyota',
    logo: `${CDN_BASE}/toyota.png`,
    country: 'Japan',
    countryAr: 'اليابان',
    taglineAr: 'رمز الاعتمادية والجودة العالية في مصر',
    models: [
      { name: 'Corolla', nameAr: 'كورولا', slug: 'corolla', category: 'Sedan' },
      { name: 'Fortuner', nameAr: 'فورتشنر', slug: 'fortuner', category: 'SUV' },
      { name: 'Yaris', nameAr: 'ياريس', slug: 'yaris', category: 'Hatchback' },
      { name: 'Land Cruiser', nameAr: 'لاند كروزر', slug: 'land-cruiser', category: 'SUV' },
      { name: 'Belta', nameAr: 'بيلتا', slug: 'belta', category: 'Sedan' },
      { name: 'Rumion', nameAr: 'روميون', slug: 'rumion', category: 'MPV' },
      { name: 'Camry', nameAr: 'كامري', slug: 'camry', category: 'Sedan' },
      { name: 'RAV4', nameAr: 'راف فور', slug: 'rav4', category: 'SUV' },
      { name: 'Hilux', nameAr: 'هايلوكس', slug: 'hilux', category: 'Pickup' },
    ],
  },
  {
    name: 'Mercedes-Benz',
    nameAr: 'مرسيدس بنز',
    slug: 'mercedes-benz',
    logo: `${CDN_BASE}/mercedes-benz.png`,
    country: 'Germany',
    countryAr: 'ألمانيا',
    taglineAr: 'قمة الفخامة والأداء الألماني المتطور',
    models: [
      { name: 'C-Class', nameAr: 'سي كلاس (C180 / C200)', slug: 'c-class', category: 'Sedan' },
      { name: 'E-Class', nameAr: 'إي كلاس (E200 / E300)', slug: 'e-class', category: 'Sedan' },
      { name: 'S-Class', nameAr: 'إس كلاس (S500)', slug: 's-class', category: 'Sedan' },
      { name: 'GLC', nameAr: 'جي إل سي', slug: 'glc', category: 'SUV' },
      { name: 'CLA', nameAr: 'سي إل إيه', slug: 'cla', category: 'Coupe' },
      { name: 'GLA', nameAr: 'جي إل إيه', slug: 'gla', category: 'Crossover' },
      { name: 'GLE', nameAr: 'جي إل إي', slug: 'gle', category: 'SUV' },
      { name: 'G-Class', nameAr: 'جي كلاس (G63)', slug: 'g-class', category: 'SUV' },
    ],
  },
  {
    name: 'BMW',
    nameAr: 'بي إم دابليو',
    slug: 'bmw',
    logo: `${CDN_BASE}/bmw.png`,
    country: 'Germany',
    countryAr: 'ألمانيا',
    taglineAr: 'متعة القيادة الرياضية الفاخرة المطلقة',
    models: [
      { name: '3 Series', nameAr: 'الفئة الثالثة (320i)', slug: '3-series', category: 'Sedan' },
      { name: '5 Series', nameAr: 'الفئة الخامسة (520i)', slug: '5-series', category: 'Sedan' },
      { name: '7 Series', nameAr: 'الفئة السابعة (740i)', slug: '7-series', category: 'Sedan' },
      { name: 'X1', nameAr: 'إكس 1', slug: 'x1', category: 'SUV' },
      { name: 'X3', nameAr: 'إكس 3', slug: 'x3', category: 'SUV' },
      { name: 'X5', nameAr: 'إكس 5', slug: 'x5', category: 'SUV' },
      { name: 'X6', nameAr: 'إكس 6', slug: 'x6', category: 'SUV' },
      { name: 'X7', nameAr: 'إكس 7', slug: 'x7', category: 'SUV' },
    ],
  },
  {
    name: 'Hyundai',
    nameAr: 'هيونداي',
    slug: 'hyundai',
    logo: `${CDN_BASE}/hyundai.png`,
    country: 'South Korea',
    countryAr: 'كوريا الجنوبية',
    taglineAr: 'السيارة الأكثر انتشاراً وثقة في السوق المصري',
    models: [
      { name: 'Tucson', nameAr: 'توسان', slug: 'tucson', category: 'SUV' },
      { name: 'Elantra CN7', nameAr: 'إلنترا CN7', slug: 'elantra-cn7', category: 'Sedan' },
      { name: 'Elantra HD', nameAr: 'إلنترا HD', slug: 'elantra-hd', category: 'Sedan' },
      { name: 'Accent RB', nameAr: 'أكسنت RB', slug: 'accent-rb', category: 'Sedan' },
      { name: 'Creta', nameAr: 'كريتا', slug: 'creta', category: 'SUV' },
      { name: 'Bayon', nameAr: 'بايون', slug: 'bayon', category: 'Crossover' },
      { name: 'Santa Fe', nameAr: 'سانتا في', slug: 'santa-fe', category: 'SUV' },
    ],
  },
  {
    name: 'Kia',
    nameAr: 'كيا',
    slug: 'kia',
    logo: `${CDN_BASE}/kia.png`,
    country: 'South Korea',
    countryAr: 'كوريا الجنوبية',
    taglineAr: 'تصاميم عصرية وديناميكية مبتكرة',
    models: [
      { name: 'Sportage', nameAr: 'سبورتاج', slug: 'sportage', category: 'SUV' },
      { name: 'Cerato', nameAr: 'سيراتو / جراند سيراتو', slug: 'cerato', category: 'Sedan' },
      { name: 'Seltos', nameAr: 'سيلتوس', slug: 'seltos', category: 'SUV' },
      { name: 'Sorento', nameAr: 'سورينتو', slug: 'sorento', category: 'SUV' },
      { name: 'Carens', nameAr: 'كارنز', slug: 'carens', category: 'MPV' },
      { name: 'Pegas', nameAr: 'بيجاس', slug: 'pegas', category: 'Sedan' },
      { name: 'EV6', nameAr: 'إي في 6 (كهربائية)', slug: 'ev6', category: 'EV' },
    ],
  },
  {
    name: 'MG',
    nameAr: 'إم جي',
    slug: 'mg',
    logo: `${CDN_BASE}/mg.png`,
    country: 'United Kingdom / China',
    countryAr: 'إنجلترا / الصين',
    taglineAr: 'العلامة الأسرع نمواً مع التكنولوجيا المتقدمة',
    models: [
      { name: 'MG ZS', nameAr: 'إم جي ZS', slug: 'mg-zs', category: 'SUV' },
      { name: 'MG 5', nameAr: 'إم جي 5', slug: 'mg-5', category: 'Sedan' },
      { name: 'MG 6', nameAr: 'إم جي 6', slug: 'mg-6', category: 'Sedan' },
      { name: 'MG RX5', nameAr: 'إم جي RX5', slug: 'mg-rx5', category: 'SUV' },
      { name: 'MG HS', nameAr: 'إم جي HS', slug: 'mg-hs', category: 'SUV' },
      { name: 'MG ONE', nameAr: 'إم جي ONE', slug: 'mg-one', category: 'SUV' },
      { name: 'MG 4', nameAr: 'إم جي 4 (كهربائية)', slug: 'mg-4', category: 'EV' },
    ],
  },
  {
    name: 'Chery',
    nameAr: 'شيري',
    slug: 'chery',
    logo: `${CDN_BASE}/chery.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'سيارات الدفع الرباعي العائلية الرائدة في مصر',
    models: [
      { name: 'Tiggo 7', nameAr: 'تيجو 7', slug: 'tiggo-7', category: 'SUV' },
      { name: 'Tiggo 8', nameAr: 'تيجو 8 (7 راكب)', slug: 'tiggo-8', category: 'SUV' },
      { name: 'Tiggo 3', nameAr: 'تيجو 3', slug: 'tiggo-3', category: 'SUV' },
      { name: 'Tiggo 4 Pro', nameAr: 'تيجو 4 برو', slug: 'tiggo-4-pro', category: 'SUV' },
      { name: 'Arrizo 5', nameAr: 'أريزو 5', slug: 'arrizo-5', category: 'Sedan' },
    ],
  },
  {
    name: 'Nissan',
    nameAr: 'نيسان',
    slug: 'nissan',
    logo: `${CDN_BASE}/nissan.png`,
    country: 'Japan',
    countryAr: 'اليابان',
    taglineAr: 'ابتكار يثير الحماس واعتمادية عريقة',
    models: [
      { name: 'Sunny', nameAr: 'صني', slug: 'sunny', category: 'Sedan' },
      { name: 'Sentra', nameAr: 'سنترا', slug: 'sentra', category: 'Sedan' },
      { name: 'Qashqai', nameAr: 'قشقاي', slug: 'qashqai', category: 'SUV' },
      { name: 'Juke', nameAr: 'جوك', slug: 'juke', category: 'Crossover' },
      { name: 'X-Trail', nameAr: 'إكس تريل', slug: 'x-trail', category: 'SUV' },
      { name: 'Patrol', nameAr: 'باترول', slug: 'patrol', category: 'SUV' },
    ],
  },
  {
    name: 'BYD',
    nameAr: 'بي واي دي',
    slug: 'byd',
    logo: `${CDN_BASE}/byd.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'رائد ثورة السيارات الكهربائية والهجينة عالمياً',
    models: [
      { name: 'F3', nameAr: 'إف 3', slug: 'byd-f3', category: 'Sedan' },
      { name: 'Song Plus', nameAr: 'سونج بلس', slug: 'song-plus', category: 'SUV' },
      { name: 'Yuan Plus', nameAr: 'يوان بلس (Atto 3)', slug: 'yuan-plus', category: 'SUV' },
      { name: 'Han', nameAr: 'هان', slug: 'byd-han', category: 'Sedan' },
      { name: 'Seal', nameAr: 'سيل', slug: 'byd-seal', category: 'Sedan' },
    ],
  },
  {
    name: 'Geely',
    nameAr: 'جيلي',
    slug: 'geely',
    logo: `${CDN_BASE}/geely.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'تكنولوجيا متقدمة وتصميم أوروبي جذاب',
    models: [
      { name: 'Coolray', nameAr: 'كول راي', slug: 'coolray', category: 'SUV' },
      { name: 'Emgrand', nameAr: 'إمجراند', slug: 'emgrand', category: 'Sedan' },
      { name: 'Okavango', nameAr: 'أوكافانجو (7 راكب)', slug: 'okavango', category: 'SUV' },
      { name: 'Monjaro', nameAr: 'مونجارو', slug: 'monjaro', category: 'SUV' },
      { name: 'Starray', nameAr: 'ستار راي', slug: 'starray', category: 'SUV' },
    ],
  },
  {
    name: 'Peugeot',
    nameAr: 'بيجو',
    slug: 'peugeot',
    logo: `${CDN_BASE}/peugeot.png`,
    country: 'France',
    countryAr: 'فرنسا',
    taglineAr: 'سحر التصميم الفرنسي والراحة الاستثنائية',
    models: [
      { name: '3008', nameAr: 'بيجو 3008', slug: 'peugeot-3008', category: 'SUV' },
      { name: '5008', nameAr: 'بيجو 5008 (7 راكب)', slug: 'peugeot-5008', category: 'SUV' },
      { name: '2008', nameAr: 'بيجو 2008', slug: 'peugeot-2008', category: 'SUV' },
      { name: '508', nameAr: 'بيجو 508', slug: 'peugeot-508', category: 'Sedan' },
      { name: '301', nameAr: 'بيجو 301', slug: 'peugeot-301', category: 'Sedan' },
      { name: '408', nameAr: 'بيجو 408', slug: 'peugeot-408', category: 'Crossover' },
    ],
  },
  {
    name: 'Renault',
    nameAr: 'رينو',
    slug: 'renault',
    logo: `${CDN_BASE}/renault.png`,
    country: 'France',
    countryAr: 'فرنسا',
    taglineAr: 'شغف بالحياة وسيارات عائلية اقتصادية',
    models: [
      { name: 'Megane', nameAr: 'ميجان', slug: 'megane', category: 'Sedan' },
      { name: 'Duster', nameAr: 'داستر', slug: 'duster', category: 'SUV' },
      { name: 'Stepway', nameAr: 'ستيب واي', slug: 'stepway', category: 'Hatchback' },
      { name: 'Kadjar', nameAr: 'قيدجار', slug: 'kadjar', category: 'SUV' },
      { name: 'Austral', nameAr: 'أوسترال', slug: 'austral', category: 'SUV' },
    ],
  },
  {
    name: 'Skoda',
    nameAr: 'سكودا',
    slug: 'skoda',
    logo: `${CDN_BASE}/skoda.png`,
    country: 'Czech Republic / Germany',
    countryAr: 'التشيك / ألمانيا',
    taglineAr: 'ذكاء الحلول والاتساع والصلابة الأوروبية',
    models: [
      { name: 'Octavia', nameAr: 'أوكتافيا (A8)', slug: 'octavia', category: 'Sedan' },
      { name: 'Kodiaq', nameAr: 'كودياك (7 راكب)', slug: 'kodiaq', category: 'SUV' },
      { name: 'Karoq', nameAr: 'كاروك', slug: 'karoq', category: 'SUV' },
      { name: 'Kamiq', nameAr: 'كاميك', slug: 'kamiq', category: 'SUV' },
      { name: 'Superb', nameAr: 'سوبيرب', slug: 'superb', category: 'Sedan' },
    ],
  },
  {
    name: 'Volkswagen',
    nameAr: 'فولكس فاجن',
    slug: 'volkswagen',
    logo: `${CDN_BASE}/volkswagen.png`,
    country: 'Germany',
    countryAr: 'ألمانيا',
    taglineAr: 'الهندسة الألمانية الموثوقة للأجيال',
    models: [
      { name: 'Golf', nameAr: 'جولف', slug: 'golf', category: 'Hatchback' },
      { name: 'Tiguan', nameAr: 'تيجوان', slug: 'tiguan', category: 'SUV' },
      { name: 'Passat', nameAr: 'باسات', slug: 'passat', category: 'Sedan' },
      { name: 'T-Roc', nameAr: 'تي روك', slug: 't-roc', category: 'SUV' },
      { name: 'ID.4', nameAr: 'آي دي 4 (كهربائية)', slug: 'id4', category: 'EV' },
    ],
  },
  {
    name: 'Audi',
    nameAr: 'أودي',
    slug: 'audi',
    logo: `${CDN_BASE}/audi.png`,
    country: 'Germany',
    countryAr: 'ألمانيا',
    taglineAr: 'التقدم عبر التكنولوجيا والهندسة المتطورة',
    models: [
      { name: 'A4', nameAr: 'أودي A4', slug: 'audi-a4', category: 'Sedan' },
      { name: 'A6', nameAr: 'أودي A6', slug: 'audi-a6', category: 'Sedan' },
      { name: 'Q3', nameAr: 'أودي Q3', slug: 'audi-q3', category: 'SUV' },
      { name: 'Q5', nameAr: 'أودي Q5', slug: 'audi-q5', category: 'SUV' },
      { name: 'Q7', nameAr: 'أودي Q7', slug: 'audi-q7', category: 'SUV' },
      { name: 'Q8', nameAr: 'أودي Q8', slug: 'audi-q8', category: 'SUV' },
    ],
  },
  {
    name: 'Porsche',
    nameAr: 'بورشه',
    slug: 'porsche',
    logo: `${CDN_BASE}/porsche.png`,
    country: 'Germany',
    countryAr: 'ألمانيا',
    taglineAr: 'أسطورة السيارات الرياضية الفاخرة',
    models: [
      { name: 'Cayenne', nameAr: 'كايين', slug: 'cayenne', category: 'SUV' },
      { name: 'Macan', nameAr: 'ماكان', slug: 'macan', category: 'SUV' },
      { name: 'Panamera', nameAr: 'باناميرا', slug: 'panamera', category: 'Sedan' },
      { name: '911', nameAr: 'بورشه 911', slug: 'porsche-911', category: 'Coupe' },
      { name: 'Taycan', nameAr: 'تايكان (كهربائية)', slug: 'taycan', category: 'EV' },
    ],
  },
  {
    name: 'Fiat',
    nameAr: 'فيات',
    slug: 'fiat',
    logo: `${CDN_BASE}/fiat.png`,
    country: 'Italy',
    countryAr: 'إيطاليا',
    taglineAr: 'العراقة الإيطالية والسيارة الاقتصادية المفضلة',
    models: [
      { name: 'Tipo', nameAr: 'تيبو', slug: 'tipo', category: 'Sedan' },
      { name: '500', nameAr: 'فيات 500', slug: 'fiat-500', category: 'Hatchback' },
      { name: '500X', nameAr: 'فيات 500X', slug: 'fiat-500x', category: 'SUV' },
    ],
  },
  {
    name: 'Mitsubishi',
    nameAr: 'ميتسوبيشي',
    slug: 'mitsubishi',
    logo: `${CDN_BASE}/mitsubishi.png`,
    country: 'Japan',
    countryAr: 'اليابان',
    taglineAr: 'القوة والاعتمادية والرحابة العائلية',
    models: [
      { name: 'Xpander', nameAr: 'إكسباندر (7 راكب)', slug: 'xpander', category: 'MPV' },
      { name: 'Eclipse Cross', nameAr: 'إكليبس كروس', slug: 'eclipse-cross', category: 'SUV' },
      { name: 'Mirage', nameAr: 'ميراج', slug: 'mirage', category: 'Hatchback' },
      { name: 'Attrage', nameAr: 'أتراج', slug: 'attrage', category: 'Sedan' },
      { name: 'Pajero', nameAr: 'باجيرو', slug: 'pajero', category: 'SUV' },
    ],
  },
  {
    name: 'Suzuki',
    nameAr: 'سوزوكي',
    slug: 'suzuki',
    logo: `${CDN_BASE}/suzuki.png`,
    country: 'Japan',
    countryAr: 'اليابان',
    taglineAr: 'كفاءة استهلاك الوقود وسهولة القيادة',
    models: [
      { name: 'Swift', nameAr: 'سويفت', slug: 'swift', category: 'Hatchback' },
      { name: 'Dzire', nameAr: 'ديزاير', slug: 'dzire', category: 'Sedan' },
      { name: 'Ertiga', nameAr: 'إرتيجا (7 راكب)', slug: 'ertiga', category: 'MPV' },
      { name: 'Ciaz', nameAr: 'سياز', slug: 'ciaz', category: 'Sedan' },
      { name: 'Fronx', nameAr: 'فرونكس', slug: 'fronx', category: 'SUV' },
      { name: 'Jimny', nameAr: 'جيمني', slug: 'jimny', category: 'SUV' },
    ],
  },
  {
    name: 'Chevrolet',
    nameAr: 'شيفروليه',
    slug: 'chevrolet',
    logo: `${CDN_BASE}/chevrolet.png`,
    country: 'USA',
    countryAr: 'الولايات المتحدة',
    taglineAr: 'شريك الطرق المصري والسيارات التجارية والعائلية',
    models: [
      { name: 'Optra', nameAr: 'أوبترا', slug: 'optra', category: 'Sedan' },
      { name: 'Captiva', nameAr: 'كابتيفا', slug: 'captiva', category: 'SUV' },
      { name: 'Aveo', nameAr: 'أفيو', slug: 'aveo', category: 'Sedan' },
      { name: 'T-Series (الدبابة)', nameAr: 'الدبابة T-Series', slug: 't-series-dabbaba', category: 'Pickup' },
      { name: 'Jumbo', nameAr: 'جامبو', slug: 'jumbo', category: 'Truck' },
    ],
  },
  {
    name: 'Jeep',
    nameAr: 'جيب',
    slug: 'jeep',
    logo: `${CDN_BASE}/jeep.png`,
    country: 'USA',
    countryAr: 'الولايات المتحدة',
    taglineAr: 'أسطورة الطرق الوعرة والمغامرة الأصيلة',
    models: [
      { name: 'Grand Cherokee', nameAr: 'جراند شيروكي', slug: 'grand-cherokee', category: 'SUV' },
      { name: 'Wrangler', nameAr: 'رانجلر', slug: 'wrangler', category: 'SUV' },
      { name: 'Renegade', nameAr: 'رينيجيد', slug: 'renegade', category: 'SUV' },
    ],
  },
  {
    name: 'Land Rover',
    nameAr: 'لاند روفر',
    slug: 'land-rover',
    logo: `${CDN_BASE}/land-rover.png`,
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    taglineAr: 'فخامة بريطانية وقدرات دفع رباعي خارقة',
    models: [
      { name: 'Range Rover', nameAr: 'رينج روفر فوغ', slug: 'range-rover', category: 'SUV' },
      { name: 'Range Rover Sport', nameAr: 'رينج روفر سبورت', slug: 'range-rover-sport', category: 'SUV' },
      { name: 'Defender', nameAr: 'ديفيندر', slug: 'defender', category: 'SUV' },
      { name: 'Velar', nameAr: 'فيلار', slug: 'velar', category: 'SUV' },
      { name: 'Evoque', nameAr: 'إيفوك', slug: 'evoque', category: 'SUV' },
    ],
  },
  {
    name: 'Volvo',
    nameAr: 'فولفو',
    slug: 'volvo',
    logo: `${CDN_BASE}/volvo.png`,
    country: 'Sweden',
    countryAr: 'السويد',
    taglineAr: 'قمة معايير الأمان والهدوء الاسكندنافي الفاخر',
    models: [
      { name: 'XC90', nameAr: 'فولفو XC90', slug: 'xc90', category: 'SUV' },
      { name: 'XC60', nameAr: 'فولفو XC60', slug: 'xc60', category: 'SUV' },
      { name: 'XC40', nameAr: 'فولفو XC40', slug: 'xc40', category: 'SUV' },
    ],
  },
  {
    name: 'Lexus',
    nameAr: 'لكزس',
    slug: 'lexus',
    logo: `${CDN_BASE}/lexus.png`,
    country: 'Japan',
    countryAr: 'اليابان',
    taglineAr: 'إتقان الحرفية والرفاهية اليابانية الفائقة',
    models: [
      { name: 'LX600', nameAr: 'لكزس LX600', slug: 'lx600', category: 'SUV' },
      { name: 'RX350', nameAr: 'لكزس RX350', slug: 'rx350', category: 'SUV' },
      { name: 'ES350', nameAr: 'لكزس ES350', slug: 'es350', category: 'Sedan' },
      { name: 'NX350', nameAr: 'لكزس NX350', slug: 'nx350', category: 'SUV' },
    ],
  },
  {
    name: 'Cupra',
    nameAr: 'كوبرا',
    slug: 'cupra',
    logo: `${CDN_BASE}/cupra.png`,
    country: 'Spain',
    countryAr: 'إسبانيا',
    taglineAr: 'الأداء الرياضي الجريء والروح المتمردة',
    models: [
      { name: 'Formentor', nameAr: 'فورمينتور', slug: 'formentor', category: 'SUV' },
      { name: 'Leon', nameAr: 'كوبرا ليون', slug: 'cupra-leon', category: 'Hatchback' },
    ],
  },
  {
    name: 'Seat',
    nameAr: 'سيات',
    slug: 'seat',
    logo: `${CDN_BASE}/seat.png`,
    country: 'Spain',
    countryAr: 'إسبانيا',
    taglineAr: 'حيوية وحماس وتكنولوجيا مجموعة فولكس فاجن',
    models: [
      { name: 'Ibiza', nameAr: 'إبيزا', slug: 'ibiza', category: 'Hatchback' },
      { name: 'Leon', nameAr: 'سيات ليون', slug: 'seat-leon', category: 'Hatchback' },
      { name: 'Ateca', nameAr: 'أتيكا', slug: 'ateca', category: 'SUV' },
      { name: 'Arona', nameAr: 'أرونا', slug: 'arona', category: 'Crossover' },
      { name: 'Tarraco', nameAr: 'تاراكو', slug: 'tarraco', category: 'SUV' },
    ],
  },
  {
    name: 'Haval',
    nameAr: 'هافال',
    slug: 'haval',
    logo: `${CDN_BASE}/haval.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'خبراء سيارات الدفع الرباعي الذكية',
    models: [
      { name: 'Jolion', nameAr: 'جوليون', slug: 'jolion', category: 'SUV' },
      { name: 'H6', nameAr: 'هافال H6', slug: 'haval-h6', category: 'SUV' },
    ],
  },
  {
    name: 'Jetour',
    nameAr: 'جيتور',
    slug: 'jetour',
    logo: `${CDN_BASE}/jetour.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'سيارات السفر العائلية المترفة والرحابة الفائقة',
    models: [
      { name: 'Dashing', nameAr: 'داشينج', slug: 'dashing', category: 'SUV' },
      { name: 'X70 Plus', nameAr: 'إكس 70 بلس', slug: 'x70-plus', category: 'SUV' },
      { name: 'X90 Plus', nameAr: 'إكس 90 بلس (7 راكب)', slug: 'x90-plus', category: 'SUV' },
      { name: 'T2', nameAr: 'ترافيلر T2 (دفع رباعي)', slug: 'jetour-t2', category: 'SUV' },
    ],
  },
  {
    name: 'Changan',
    nameAr: 'شانجان',
    slug: 'changan',
    logo: `${CDN_BASE}/changan.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'الجودة والابتكار والأداء المتوازن',
    models: [
      { name: 'CS35 Plus', nameAr: 'CS35 بلس', slug: 'cs35-plus', category: 'SUV' },
      { name: 'CS55 Plus', nameAr: 'CS55 بلس', slug: 'cs55-plus', category: 'SUV' },
      { name: 'CS85', nameAr: 'CS85 كوبيه', slug: 'cs85', category: 'SUV' },
      { name: 'Alsvin', nameAr: 'ألسفن', slug: 'alsvin', category: 'Sedan' },
      { name: 'Eado', nameAr: 'إيدو DT', slug: 'eado', category: 'Sedan' },
    ],
  },
  {
    name: 'Baic',
    nameAr: 'بايك',
    slug: 'baic',
    logo: `${CDN_BASE}/baic-motor.png`,
    country: 'China',
    countryAr: 'الصين',
    taglineAr: 'صلابة وقوة وتجهيزات عصرية متكاملة',
    models: [
      { name: 'X3', nameAr: 'بايك X3', slug: 'baic-x3', category: 'SUV' },
      { name: 'X55', nameAr: 'بايك X55', slug: 'baic-x55', category: 'SUV' },
      { name: 'X7', nameAr: 'بايك X7', slug: 'baic-x7', category: 'SUV' },
      { name: 'BJ40', nameAr: 'بايك BJ40 (صحراوي)', slug: 'bj40', category: 'SUV' },
    ],
  },
];

function generateSql() {
  const statements = [];

  for (const b of CATALOG) {
    const brandId = `biz_brand_${b.slug.replace(/[^a-z0-9]/g, '_')}`;
    const brandCustomData = JSON.stringify({
      sec_1_identity: {
        business_name: b.name,
        business_name_ar: b.nameAr,
        logo_url: b.logo,
        country: b.country,
        country_ar: b.countryAr,
        tagline_ar: b.taglineAr,
      },
    }).replace(/'/g, "''");

    // 1. Insert/Update Brand in businesses
    statements.push(`
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('${brandId}', '${b.name.replace(/'/g, "''")}', '${b.nameAr.replace(/'/g, "''")}', '${b.slug}', 'vehicle_brand', 'automotive', NULL, '/${b.slug}', 'standalone', '${brandCustomData}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';
`.trim());

    // 2. Insert/Update Brand in site_profiles (for logo rendering)
    statements.push(`
INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', '${brandId}', 'editorial', '${b.logo}', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;
`.trim());

    // 3. Insert Models
    for (const m of b.models) {
      const modelId = `biz_model_${b.slug.replace(/[^a-z0-9]/g, '_')}_${m.slug.replace(/[^a-z0-9]/g, '_')}`;
      const modelCustomData = JSON.stringify({
        sec_1_identity: {
          business_name: `${b.name} ${m.name}`,
          business_name_ar: `${b.nameAr} ${m.nameAr}`,
          category: m.category,
        },
      }).replace(/'/g, "''");

      statements.push(`
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('${modelId}', '${m.name.replace(/'/g, "''")}', '${m.nameAr.replace(/'/g, "''")}', '${m.slug}', 'vehicle_model', 'automotive', '${brandId}', '/${b.slug}/${m.slug}', 'standalone', '${modelCustomData}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';
`.trim());
    }
  }

  return statements.join('\n\n');
}

const sql = generateSql();
const outPath = path.join(__dirname, 'seed_automotive_catalog.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated SQL for ${CATALOG.length} brands and ${CATALOG.reduce((a, b) => a + b.models.length, 0)} models at ${outPath}`);
