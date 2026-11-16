export function parseCustomDomain(value: unknown): { domain: string | null; error?: string } {
  if (value === undefined || value === null || value === '') {
    return { domain: null };
  }
  if (typeof value !== 'string') {
    return { domain: null, error: 'Enter a valid custom domain.' };
  }

  const domain = value.trim().toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
  const labels = domain.split('.');
  const isValid =
    domain.length <= 253 &&
    labels.length >= 2 &&
    labels.every((label) => label.length > 0 && label.length <= 63 && /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label));

  if (!isValid || domain === 'autofyon.com' || domain.endsWith('.autofyon.com')) {
    return { domain: null, error: 'Enter a valid domain that is not owned by the AutoFyon portal.' };
  }

  return { domain };
}
