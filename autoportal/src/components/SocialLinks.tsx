import type { SiteLocale } from '@/lib/site-locale';
import type { SocialLink } from '@/lib/social-link-types';

export default function SocialLinks({
  links,
  locale,
  label,
}: {
  links: SocialLink[];
  locale: SiteLocale;
  label: string;
}) {
  const visible = links.filter((link) => link.visible);
  if (!visible.length) return null;

  return (
    <nav aria-label={label} className="mt-4">
      <p className="mb-2 text-xs font-bold opacity-60">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {visible.map((link) => (
          <li key={link.platformKey}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              className="inline-flex rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] no-underline transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
