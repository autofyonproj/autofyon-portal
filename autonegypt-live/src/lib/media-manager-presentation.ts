export interface PresentationCopy {
  ar: string;
  en: string;
}

export interface PresentationBlock {
  id: string;
  title: PresentationCopy;
  body: PresentationCopy;
  enabled: boolean;
  order: number;
}

export interface MediaManagerPresentation {
  version: 1;
  intro: {
    eyebrow: PresentationCopy;
    title: PresentationCopy;
    description: PresentationCopy;
  };
  audiences: {
    vendors: { label: PresentationCopy; title: PresentationCopy; description: PresentationCopy };
    partners: { label: PresentationCopy; title: PresentationCopy; description: PresentationCopy };
  };
  sectionTitles: {
    benefits: PresentationCopy;
    workflow: PresentationCopy;
    freeTools: PresentationCopy;
    ecosystem: PresentationCopy;
  };
  benefits: PresentationBlock[];
  workflow: PresentationBlock[];
  freeTools: PresentationBlock[];
  ecosystem: PresentationBlock[];
  closing: PresentationCopy;
}

const copy = (ar: string, en: string): PresentationCopy => ({ ar, en });
const block = (id: string, titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, order: number): PresentationBlock => ({
  id,
  title: copy(titleAr, titleEn),
  body: copy(bodyAr, bodyEn),
  enabled: true,
  order,
});

export const DEFAULT_MEDIA_MANAGER_PRESENTATION: MediaManagerPresentation = {
  version: 1,
  intro: {
    eyebrow: copy('عرض تعريفي', 'PRODUCT WALKTHROUGH'),
    title: copy('من صورك إلى حضور أوسع لمعرضك مع AUTOFYON', 'Turn your photos into a wider presence with AUTOFYON'),
    description: copy(
      'جهّز منشورًا وفيديو من صورك، شاركهما بنفسك على حساباتك، ثم أنشئ صفحة معرضك على AUTOFYON.',
      'Create a post and video from your photos, share them yourself on your social accounts, then build your showroom page on AUTOFYON.',
    ),
  },
  audiences: {
    vendors: {
      label: copy('لأصحاب المعارض', 'For showroom owners'),
      title: copy('ابدأ بأدوات واضحة، حتى لو لم تكن لديك صفحات بعد', 'Start with simple tools—even if you have no social pages yet'),
      description: copy(
        'اكتب منشورًا، التقط صورة من هاتفك أو اخترها من جهازك، ورتّب بيانات التواصل. المسودات والوسائط في النسخة المجانية تبقى على جهازك.',
        'Write a post, take a photo on your phone or choose one from your device, and organize your contact details. Free-version drafts and media stay on your device.',
      ),
    },
    partners: {
      label: copy('للشركاء والإدارة', 'For partners and management'),
      title: copy('منشئ محتوى محلي اليوم، ونقطة انطلاق لمنظومة متصلة', 'A local-first content tool today, with a path to a connected ecosystem'),
      description: copy(
        'يوضح هذا العرض رحلة المنتج بصدق: الأدوات المحلية متاحة الآن، بينما النشر المتصل والحفظ السحابي والحملات المنفذة تتطلب تطويرًا واعتمادات لاحقة.',
        'This presentation shows the product honestly: local tools are available now, while connected publishing, cloud history, and executed campaigns require future integrations and approvals.',
      ),
    },
  },
  sectionTitles: {
    benefits: copy('ما الذي يستفيده المعرض؟', 'What does a showroom gain?'),
    workflow: copy('رحلة العمل في خطوات', 'A simple workflow'),
    freeTools: copy('ما المتاح مجانًا الآن؟', 'What is available for free today?'),
    ecosystem: copy('كيف يتوسع الحل مع AUTOFYON؟', 'How can the solution grow with AUTOFYON?'),
  },
  benefits: [
    block('mobile', 'مناسب للهاتف', 'Made for mobile', 'اختر صورة أو فيديو من جهازك، أو التقط صورة بالكاميرا لعرضها في المسودة.', 'Choose media from your device or take a photo with your camera to preview it in a draft.', 0),
    block('local', 'بياناتك تحت سيطرتك', 'Your data stays in your control', 'في النسخة المجانية تُحفظ المسودات والبيانات محليًا في المتصفح، ويمكنك تصدير نسخة احتياطية.', 'In the free version, drafts and details are stored locally in your browser, and you can export a backup.', 1),
    block('guidance', 'إرشاد خطوة بخطوة', 'Friendly setup guidance', 'اتبع روابط الإعداد الرسمية إذا كنت تبدأ من دون حسابات اجتماعية أو ملف نشاط.', 'Follow official setup links if you are starting without social accounts or a business profile.', 2),
    block('planning', 'خطط قبل أن تنشر', 'Plan before publishing', 'جهز محتوى وقوائم منتجات وخطط SEO وحملات دون إطلاق نشر خارجي أو إنفاق تلقائي.', 'Prepare content, product lists, SEO plans, and campaigns without external publishing or automatic spending.', 3),
  ],
  workflow: [
    block('profile', '١. جهّز بيانات معرضك وتواصلك', '1. Set up your showroom and contact details', 'أدخل اسم المعرض ووسائل التواصل، واتبع دليل التسجيل خطوة بخطوة. يُحفظ تقدمك محليًا لتكمل لاحقًا.', 'Add your showroom name and contact details, then follow the step-by-step setup guide. Your progress is saved locally so you can continue later.', 0),
    block('content', '٢. جهّز منشورك وفيديو صورك', '2. Create your post and photo video', 'استخدم AUTOFYON لتحويل صورك إلى كاروسيل أو فيديو قصير، ثم نزّل الملف.', 'Use AUTOFYON to turn your photos into a carousel or short video, then download the file.', 1),
    block('share', '٣. شارك على حساباتك الاجتماعية', '3. Share on your social accounts', 'ارفع الملف بنفسك إلى كل شبكة؛ النشر التلقائي غير متاح في هذا الإصدار.', 'Upload the file yourself to each network; automatic publishing is not available in this release.', 2),
    block('page', '٤. أنشئ صفحة معرضك على AUTOFYON', '4. Create your showroom page on AUTOFYON', 'انشر صفحة مجانية لمعرضك، وارفع الفيديو إلى قناتك على YouTube ثم أضف رابطه إلى الصفحة.', 'Publish a free page for your showroom, upload your video to your YouTube channel, then add its link to the page.', 3),
  ],
  freeTools: [
    block('drafts', 'مسودات المحتوى', 'Content drafts', 'إنشاء المسودات وتعديلها محليًا.', 'Create and edit drafts locally.', 0),
    block('media', 'كاروسيل وفيديو قصير', 'Social carousels and short video', 'اجمع صورك وأضف بيانًا لكل صورة، ثم نزّل كاروسيل أو فيديو قصير وارفعه بنفسك إلى حساباتك.', 'Bring your photos together, add a fact to each image, then download a carousel or short video to upload yourself to your accounts.', 1),
    block('catalog', 'كتالوج المنتجات', 'Product catalog', 'ترتيب المنتجات والخدمات التي تريد الترويج لها.', 'Organize the products and services you want to promote.', 2),
    block('plans', 'خطط SEO والحملات', 'SEO and campaign plans', 'إعداد أفكار وروابط متابعة دون تفعيل إعلان أو نشر خارجي.', 'Prepare ideas and tracking links without launching ads or external publishing.', 3),
  ],
  ecosystem: [
    block('website', 'موقع نشاطك', 'Your business website', 'مسار لإنشاء موقع وإبراز المنتجات والخدمات بعد تفعيل الربط.', 'A path to build a website and showcase products and services when connected services are available.', 0),
    block('crm', 'متابعة العملاء عبر CRM', 'Follow up with customers in CRM', 'تنظيم الاستفسارات وفرص البيع ضمن منظومة Almostashar.', 'Organize inquiries and sales opportunities within Almostashar.', 1),
    block('channels', 'القنوات الاجتماعية', 'Social channels', 'تكامل النشر يحتاج تفويضًا آمنًا وموافقات المنصات؛ لا يعمل تلقائيًا في هذا الإصدار.', 'Publishing integrations require secure authorization and provider approval; they are not active in this release.', 2),
  ],
  closing: copy(
    'تنبيه: هذا الإصدار يجهز المحتوى والخطط محليًا فقط. لا يرفع الوسائط إلى Cloudinary أو YouTube، ولا ينشر تلقائيًا، ولا يحفظ سجلًا سحابيًا.',
    'Important: this release prepares content and plans locally only. It does not upload media to Cloudinary or YouTube, publish automatically, or keep cloud history.',
  ),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateCopy(value: unknown, path: string): PresentationCopy {
  if (!isRecord(value) || typeof value.ar !== 'string' || typeof value.en !== 'string') {
    throw new Error(`${path} must include Arabic and English text.`);
  }
  if (value.ar.length > 2000 || value.en.length > 2000) throw new Error(`${path} is too long.`);
  return { ar: value.ar, en: value.en };
}

function validateBlock(value: unknown, path: string): PresentationBlock {
  if (!isRecord(value) || typeof value.id !== 'string' || !/^[a-z0-9_-]{1,40}$/.test(value.id)) {
    throw new Error(`${path} has an invalid block identifier.`);
  }
  if (typeof value.enabled !== 'boolean' || !Number.isInteger(value.order) || Number(value.order) < 0 || Number(value.order) > 100) {
    throw new Error(`${path} has invalid visibility or ordering.`);
  }
  return {
    id: value.id,
    title: validateCopy(value.title, `${path}.title`),
    body: validateCopy(value.body, `${path}.body`),
    enabled: value.enabled,
    order: Number(value.order),
  };
}

function validateBlocks(value: unknown, path: string): PresentationBlock[] {
  if (!Array.isArray(value) || value.length > 20) throw new Error(`${path} must be a list of up to 20 blocks.`);
  const blocks = value.map((item, index) => validateBlock(item, `${path}[${index}]`));
  if (new Set(blocks.map((item) => item.id)).size !== blocks.length) throw new Error(`${path} contains duplicate block identifiers.`);
  return blocks;
}

function validateAudience(value: unknown, path: string) {
  if (!isRecord(value)) throw new Error(`${path} is required.`);
  return {
    label: validateCopy(value.label, `${path}.label`),
    title: validateCopy(value.title, `${path}.title`),
    description: validateCopy(value.description, `${path}.description`),
  };
}

export function validateMediaManagerPresentation(value: unknown): MediaManagerPresentation {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.intro) || !isRecord(value.audiences) || !isRecord(value.sectionTitles)) {
    throw new Error('Presentation content is missing required sections.');
  }
  if (!isRecord(value.audiences)) throw new Error('Presentation audiences are required.');
  if (!isRecord(value.sectionTitles)) throw new Error('Presentation section titles are required.');
  return {
    version: 1,
    intro: {
      eyebrow: validateCopy(value.intro.eyebrow, 'intro.eyebrow'),
      title: validateCopy(value.intro.title, 'intro.title'),
      description: validateCopy(value.intro.description, 'intro.description'),
    },
    audiences: {
      vendors: validateAudience(value.audiences.vendors, 'audiences.vendors'),
      partners: validateAudience(value.audiences.partners, 'audiences.partners'),
    },
    sectionTitles: {
      benefits: validateCopy(value.sectionTitles.benefits, 'sectionTitles.benefits'),
      workflow: validateCopy(value.sectionTitles.workflow, 'sectionTitles.workflow'),
      freeTools: validateCopy(value.sectionTitles.freeTools, 'sectionTitles.freeTools'),
      ecosystem: validateCopy(value.sectionTitles.ecosystem, 'sectionTitles.ecosystem'),
    },
    benefits: validateBlocks(value.benefits, 'benefits'),
    workflow: validateBlocks(value.workflow, 'workflow'),
    freeTools: validateBlocks(value.freeTools, 'freeTools'),
    ecosystem: validateBlocks(value.ecosystem, 'ecosystem'),
    closing: validateCopy(value.closing, 'closing'),
  };
}
