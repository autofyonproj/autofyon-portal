import { execute, queryOne, parseJson } from '@/lib/db';

export interface PortalLocaleCopy {
  badge: string;
  title: string;
  description: string;
  productsTitle: string;
  productsDescription: string;
  featuredTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
}

export type CarouselPresentationType =
  | 'cinematic'
  | 'modern_split'
  | 'card_stage'
  | 'filmstrip'
  | 'fade_minimal';

export interface PortalCarouselSlide {
  id: string;
  media_type: 'image' | 'youtube' | 'video';
  url: string;
  title_ar: string;
  title_en: string;
  caption_ar?: string;
  caption_en?: string;
  badge_ar?: string;
  badge_en?: string;
  cta_text_ar?: string;
  cta_text_en?: string;
  cta_link?: string;
  startTime?: number;
  endTime?: number;
}

export interface PlatformAd {
  id: string;
  imageUrl: string;
  titleAr: string;
  titleEn: string;
  linkUrl: string;
}

export interface PlatformNewsItem {
  id: string;
  textAr: string;
  textEn: string;
  linkUrl: string;
}

export interface PortalPageContent {
  accentColor: string;
  backgroundColor: string;
  carouselType: CarouselPresentationType;
  carouselSlides: PortalCarouselSlide[];
  platformAds: PlatformAd[];
  newsRibbon: PlatformNewsItem[];
  enabledSections: string[];
  en: PortalLocaleCopy;
  ar: PortalLocaleCopy;
}

export interface PortalPageState {
  draft: PortalPageContent;
  published: PortalPageContent | null;
}

const DEFAULT_SLIDES: PortalCarouselSlide[] = [
  {
    id: 'slide-bmw-i7',
    media_type: 'youtube',
    url: 'https://www.youtube.com/watch?v=1F3hm6MfR1k',
    startTime: 10,
    endTime: 40,
    badge_ar: '👑 أحدث السيارات الفاخرة المعتمدة',
    badge_en: '👑 Flagship Luxury Spotlight',
    title_ar: 'بي إم دبليو الفئة السابعة الكهربائية BMW i7',
    title_en: 'All-New All-Electric Flagship BMW i7',
    caption_ar: 'جولة تفصيلية حية بالفيديو — قمة الفخامة الألمانية وتجربة القيادة الملكية متوفرة للتسليم في مصر',
    caption_en: 'Live 4K cinematic walkaround — the pinnacle of automotive luxury available for delivery in Egypt',
    cta_text_ar: 'استكشف مواصفات الفئة السابعة',
    cta_text_en: 'Explore BMW 7 Series',
    cta_link: '/bmw',
  },
  {
    id: 'slide-join-dealers',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=80',
    badge_ar: '🎁 عرض انضمام الشركاء والمعارض',
    badge_en: '🎁 Partner Showrooms Special Offer',
    title_ar: 'احصل على موقع معرضك الفاخر وبرنامج الـ ERP مجاناً',
    title_en: 'Launch Your Luxury Showroom Website & ERP System',
    caption_ar: 'انضم إلى شبكة AutoFyon الكبرى واعرض أسطولك أمام آلاف المشترين المستعدين في كافة أنحاء مصر',
    caption_en: 'Join Egypt united automotive dealer network and connect with thousands of active car buyers',
    cta_text_ar: 'انضم كمعرض شريك الآن',
    cta_text_en: 'Join as Partner Showroom',
    cta_link: '/join',
  },
  {
    id: 'slide-bmw-m4',
    media_type: 'image',
    url: 'https://prod.pictures.autoscout24.net/listing-images/a6c5cfd7-d775-4700-a548-bc3ff45a35ea_88cbca93-7935-4424-9b2f-7c1ceeb4a7f3.jpg',
    badge_ar: '⚡ أداء رياضي خارق وتسليم فوري',
    badge_en: '⚡ Pure Track Performance',
    title_ar: 'بي إم دبليو M4 كومبيتيشن — قوة 510 حصان',
    title_en: 'BMW M4 Competition Coupé',
    caption_ar: 'محرك M TwinPower Turbo وقوة جبارة لتجربة تسارع استثنائية مع خيارات التقسيط',
    caption_en: 'Pure motorsport DNA engineered for ultimate precision on the road',
    cta_text_ar: 'مشاهدة أسطول M Power',
    cta_text_en: 'View M Power Fleet',
    cta_link: '/bmw',
  },
  {
    id: 'slide-financing',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80',
    badge_ar: '🏛️ أكثر من 2,800 معرض معتمد',
    badge_en: '🏛️ 2,800+ Verified Dealerships',
    title_ar: 'أكبر دليل معارض سيارات وأنظمة تقسيط وتسليم فوري في مصر',
    title_en: 'Verified Showrooms & Flexible Auto Financing',
    caption_ar: 'برامج تمويل بنكية وتأمين شامل على كافة السيارات الفاخرة المعتمدة لدى الوكلاء',
    caption_en: 'Comprehensive bank financing and direct showroom reservations',
    cta_text_ar: 'تصفح السيارات المتاحة',
    cta_text_en: 'Browse Available Cars',
    cta_link: '/cars',
  },
];

const DEFAULTS: PortalPageContent = {
  accentColor: '#c4a265',
  backgroundColor: '#07090c',
  carouselType: 'cinematic',
  carouselSlides: DEFAULT_SLIDES,
  platformAds: [],
  newsRibbon: [],
  enabledSections: ['carousel', 'products', 'featured', 'cta'],
  en: {
    badge: 'EGYPT PREMIER AUTOMOTIVE MARKETPLACE & VENDOR PORTAL',
    title: 'The Premier AutoFyon Automotive Portal',
    description: 'Discover certified luxury vehicles from top dealerships with live financing tools and full dealer management systems.',
    productsTitle: 'The 4 Complete Solutions for Auto Showrooms',
    productsDescription: 'Empowering auto dealers with four standalone & networked tools designed for the Egyptian automotive market.',
    featuredTitle: 'Featured Showrooms & Brands',
    ctaTitle: 'Grow Your Showroom on AutoFyon Platform',
    ctaDescription: 'Join the united automotive network. Receive your custom luxury showroom website, full ERP & CRM suite, and connect with serious car buyers today.',
    ctaButton: 'Join as Partner Showroom Now',
  },
  ar: {
    badge: 'البوابة المركزية الأولى لسوق ومعارض السيارات في مصر',
    title: 'منصة AutoFyon الكبرى — ملتقى السيارات الفاخرة وشبكة المعارض الموحدة',
    description: 'تصفح أحدث السيارات المعتمدة والمتاحة للتسليم الفوري من كبرى المعارض والوكلاء، أو انضم كمعرض شريك واستفد من 4 حلول ذكية متكاملة لإدارة مبيعاتك وحساباتك.',
    productsTitle: 'حلول AutoFyon المتكاملة لشركائنا من المعارض',
    productsDescription: 'نوفر لأصحاب المعارض والوكلاء منظومة تقنية شاملة من 4 حلول مترابطة تعمل كـ Standalone محلي أو تتصل بالشبكة المركزية بمرونة كاملة.',
    featuredTitle: 'المعارض وصالات العرض المشتركة',
    ctaTitle: 'هل تمتلك معرضاً أو أسطول سيارات؟ انضم إلى شبكة AutoFyon الآن',
    ctaDescription: 'احصل على موقعك الفاخر الخاص، وبرنامج المحاسبة والـ ERP، وانضم مجاناً إلى شبكة سوق المعارض لتبادل السيارات أمام آلاف المشترين المستعدين في كافة محافظات مصر.',
    ctaButton: 'انضم إلينا كمعرض شريك الآن',
  },
};

const COPY_KEYS: (keyof PortalLocaleCopy)[] = [
  'badge', 'title', 'description', 'productsTitle', 'productsDescription',
  'featuredTitle', 'ctaTitle', 'ctaDescription', 'ctaButton',
];
const SECTIONS = ['carousel', 'products', 'featured', 'cta'] as const;
const CAROUSEL_TYPES: CarouselPresentationType[] = [
  'cinematic',
  'modern_split',
  'card_stage',
  'filmstrip',
  'fade_minimal',
];

type SettingsEnvelope = {
  widgets?: string[];
  portal?: Partial<PortalPageState>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeLink(value: unknown): string {
  if (typeof value !== 'string') return '';
  const link = value.trim().slice(0, 1000);
  if (link.startsWith('/') && !link.startsWith('//') && !link.includes('\\')) return link;
  try {
    const url = new URL(link);
    return url.protocol === 'https:' ? link : '';
  } catch {
    return '';
  }
}

function normalizeContent(value: unknown): PortalPageContent {
  const raw = isRecord(value) ? value : {};
  const result = structuredClone(DEFAULTS);
  if (typeof raw.accentColor === 'string' && /^#[\da-f]{6}$/i.test(raw.accentColor)) result.accentColor = raw.accentColor;
  if (typeof raw.backgroundColor === 'string' && /^#[\da-f]{6}$/i.test(raw.backgroundColor)) result.backgroundColor = raw.backgroundColor;
  
  if (typeof raw.carouselType === 'string' && CAROUSEL_TYPES.includes(raw.carouselType as CarouselPresentationType)) {
    result.carouselType = raw.carouselType as CarouselPresentationType;
  }

  if (Array.isArray(raw.carouselSlides) && raw.carouselSlides.length > 0) {
    const validSlides: PortalCarouselSlide[] = [];
    for (const s of raw.carouselSlides) {
      if (isRecord(s) && typeof s.url === 'string' && s.url.trim().length > 0) {
        validSlides.push({
          id: typeof s.id === 'string' && s.id ? s.id : `slide-${Math.random().toString(36).slice(2, 9)}`,
          media_type: s.media_type === 'youtube' || s.media_type === 'video' ? s.media_type : 'image',
          url: s.url.trim(),
          title_ar: typeof s.title_ar === 'string' ? s.title_ar : '',
          title_en: typeof s.title_en === 'string' ? s.title_en : '',
          caption_ar: typeof s.caption_ar === 'string' ? s.caption_ar : undefined,
          caption_en: typeof s.caption_en === 'string' ? s.caption_en : undefined,
          badge_ar: typeof s.badge_ar === 'string' ? s.badge_ar : undefined,
          badge_en: typeof s.badge_en === 'string' ? s.badge_en : undefined,
          cta_text_ar: typeof s.cta_text_ar === 'string' ? s.cta_text_ar : undefined,
          cta_text_en: typeof s.cta_text_en === 'string' ? s.cta_text_en : undefined,
          cta_link: typeof s.cta_link === 'string' ? s.cta_link : undefined,
          startTime: typeof s.startTime === 'number' ? s.startTime : undefined,
          endTime: typeof s.endTime === 'number' ? s.endTime : undefined,
        });
      }
    }
    if (validSlides.length > 0) {
      result.carouselSlides = validSlides;
    }
  }

  if (Array.isArray(raw.platformAds)) {
    result.platformAds = raw.platformAds.slice(0, 12).flatMap((item): PlatformAd[] => {
      if (!isRecord(item)) return [];
      const imageUrl = safeLink(item.imageUrl);
      const linkUrl = safeLink(item.linkUrl);
      const titleAr = typeof item.titleAr === 'string' ? item.titleAr.trim().slice(0, 160) : '';
      const titleEn = typeof item.titleEn === 'string' ? item.titleEn.trim().slice(0, 160) : '';
      if (!imageUrl || !linkUrl || (!titleAr && !titleEn)) return [];
      return [{
        id: typeof item.id === 'string' ? item.id.slice(0, 80) : `ad-${Math.random().toString(36).slice(2, 9)}`,
        imageUrl,
        titleAr,
        titleEn,
        linkUrl,
      }];
    });
  }

  if (Array.isArray(raw.newsRibbon)) {
    result.newsRibbon = raw.newsRibbon.slice(0, 20).flatMap((item): PlatformNewsItem[] => {
      if (!isRecord(item)) return [];
      const linkUrl = safeLink(item.linkUrl);
      const textAr = typeof item.textAr === 'string' ? item.textAr.trim().slice(0, 240) : '';
      const textEn = typeof item.textEn === 'string' ? item.textEn.trim().slice(0, 240) : '';
      if (!linkUrl || (!textAr && !textEn)) return [];
      return [{
        id: typeof item.id === 'string' ? item.id.slice(0, 80) : `news-${Math.random().toString(36).slice(2, 9)}`,
        textAr,
        textEn,
        linkUrl,
      }];
    });
  }

  if (Array.isArray(raw.enabledSections)) {
    result.enabledSections = [...new Set(raw.enabledSections.filter(
      (item): item is string => typeof item === 'string' && (SECTIONS as readonly string[]).includes(item),
    ))];
  }
  for (const locale of ['en', 'ar'] as const) {
    const rawLocale = isRecord(raw[locale]) ? raw[locale] as Record<string, unknown> : {};
    for (const key of COPY_KEYS) {
      if (typeof rawLocale[key] === 'string') {
        result[locale][key] = (rawLocale[key] as string).trim().slice(0, 1000);
      }
    }
  }
  return result;
}

function parseSettings(raw: string | null): SettingsEnvelope {
  const parsed = parseJson<unknown>(raw, []);
  if (Array.isArray(parsed)) return { widgets: parsed.filter((item): item is string => typeof item === 'string') };
  if (!isRecord(parsed)) return {};
  return {
    widgets: Array.isArray(parsed.widgets)
      ? parsed.widgets.filter((item): item is string => typeof item === 'string')
      : undefined,
    portal: isRecord(parsed.portal) ? parsed.portal as Partial<PortalPageState> : undefined,
  };
}

async function loadEnvelope(): Promise<SettingsEnvelope> {
  const row = await queryOne<{ widgets: string }>('SELECT widgets FROM global_blog_settings WHERE id = 1');
  return parseSettings(row?.widgets ?? null);
}

export async function loadPortalPageState(): Promise<PortalPageState> {
  const portal = (await loadEnvelope()).portal;
  return {
    draft: normalizeContent(portal?.draft),
    published: portal?.published ? normalizeContent(portal.published) : null,
  };
}

export async function loadPublishedPortalContent(): Promise<PortalPageContent> {
  const state = await loadPortalPageState();
  return state.published ?? DEFAULT_PORTAL_PAGE;
}

export async function savePortalPage(
  action: 'save' | 'publish',
  value: unknown,
): Promise<PortalPageState> {
  const envelope = await loadEnvelope();
  const draft = normalizeContent(value);
  const state: PortalPageState = {
    draft,
    published: action === 'publish' ? draft : envelope.portal?.published
      ? normalizeContent(envelope.portal.published)
      : null,
  };
  envelope.portal = state;
  await execute(
    `INSERT INTO global_blog_settings (id, widgets, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET widgets = excluded.widgets, updated_at = CURRENT_TIMESTAMP`,
    [JSON.stringify(envelope)],
  );
  return state;
}

export const DEFAULT_PORTAL_PAGE = DEFAULTS;
