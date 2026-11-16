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

export interface PortalPageContent {
  accentColor: string;
  backgroundColor: string;
  enabledSections: string[];
  en: PortalLocaleCopy;
  ar: PortalLocaleCopy;
}

export interface PortalPageState {
  draft: PortalPageContent;
  published: PortalPageContent | null;
}

const DEFAULTS: PortalPageContent = {
  accentColor: '#c4a265',
  backgroundColor: '#07090c',
  enabledSections: ['products', 'featured', 'cta'],
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
const SECTIONS = ['products', 'featured', 'cta'] as const;

type SettingsEnvelope = {
  widgets?: string[];
  portal?: Partial<PortalPageState>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeContent(value: unknown): PortalPageContent {
  const raw = isRecord(value) ? value : {};
  const result = structuredClone(DEFAULTS);
  if (typeof raw.accentColor === 'string' && /^#[\da-f]{6}$/i.test(raw.accentColor)) result.accentColor = raw.accentColor;
  if (typeof raw.backgroundColor === 'string' && /^#[\da-f]{6}$/i.test(raw.backgroundColor)) result.backgroundColor = raw.backgroundColor;
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
