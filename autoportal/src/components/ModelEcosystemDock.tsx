import type { ModelServiceCategory } from '@/lib/minisite';
import { localePath, type SiteLocale } from '@/lib/site-locale';

function serviceSectionHref(
  locale: SiteLocale,
  modelSlug: string,
  sectionId: string,
  isCustomDomain: boolean,
): string {
  const segments = isCustomDomain ? [sectionId] : [modelSlug, sectionId];
  return localePath(locale, segments);
}

function providerHref(locale: SiteLocale, slug: string, isCustomDomain: boolean): string {
  const path = localePath(locale, [slug]);
  return isCustomDomain ? `https://autofyon.com${path}` : path;
}

export default function ModelEcosystemDock({
  modelSlug,
  services,
  locale,
  isCustomDomain,
}: {
  modelSlug: string;
  services: ModelServiceCategory[];
  locale: SiteLocale;
  isCustomDomain: boolean;
}) {
  const isAr = locale === 'ar';

  return (
    <section
      className="panel mt-12 border-t border-[var(--line)] pt-8"
      aria-labelledby="model-services-heading"
    >
      <div className="mb-5">
        <h2 id="model-services-heading" className="text-xl font-bold text-[var(--ink)]">
          {isAr ? 'خدمات مرتبطة بهذه السيارة' : 'Services for this car'}
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {isAr
            ? 'روابط إلى الخدمات ومقدميها المرتبطين بهذه السيارة.'
            : 'Quick links to service sections and providers linked to this model.'}
        </p>
      </div>

      <nav
        aria-label={isAr ? 'خدمات السيارة' : 'Car services'}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-[var(--line)] bg-white/70 p-4"
          >
            <a
              href={serviceSectionHref(locale, modelSlug, service.sectionId, isCustomDomain)}
              className="font-semibold text-[var(--signal)] underline-offset-4 hover:underline"
            >
              {isAr ? service.label_ar : service.label}
              <span aria-hidden="true" className="ms-1">{isAr ? '←' : '→'}</span>
            </a>
            {service.providers.length ? (
              <ul className="mt-3 space-y-2 border-t border-[var(--line)] pt-3">
                {service.providers.map((provider) => (
                  <li key={provider.id}>
                    <a
                      href={providerHref(locale, provider.slug, isCustomDomain)}
                      className="text-sm text-[var(--ink)] underline-offset-4 hover:text-[var(--signal)] hover:underline"
                    >
                      {provider.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[var(--ink-soft)]">
                {isAr ? 'لا يوجد مقدم خدمة مرتبط موثق حالياً.' : 'No verified provider is linked yet.'}
              </p>
            )}
          </div>
        ))}
      </nav>
    </section>
  );
}
