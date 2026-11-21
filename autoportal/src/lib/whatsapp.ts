interface MetaMessageResponse {
  error?: {
    code?: number;
  };
}

export async function sendWhatsAppOtp(phone: string, code: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_OTP_TEMPLATE;

  if (!token || !phoneNumberId || !templateName) {
    throw new Error('WhatsApp OTP delivery is not configured.');
  }

  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || 'v22.0';
  const language = process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE || 'ar';
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components: [{
            type: 'body',
            parameters: [{ type: 'text', text: code }],
          }],
        },
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as MetaMessageResponse;
    throw new Error(`WhatsApp OTP delivery failed (${response.status}${result.error?.code ? `/${result.error.code}` : ''}).`);
  }
}

export function normalizeWhatsAppPhone(rawPhone: string, countryCode: string): string {
  const rawDigits = rawPhone.replace(/\D/g, '');
  const digits = rawDigits.startsWith('00') ? rawDigits.slice(2) : rawDigits;
  if (!digits) return '';

  if (!['EG', 'SA', 'QA'].includes(countryCode)) {
    return /^(20|966|974)\d{8,12}$/.test(digits) ? digits : '';
  }
  const callingCode = countryCode === 'SA' ? '966' : countryCode === 'QA' ? '974' : '20';
  if (digits.startsWith(callingCode)) return digits;
  if (digits.startsWith('0')) return `${callingCode}${digits.slice(1)}`;
  if (countryCode === 'EG' && digits.length === 10) return `20${digits}`;
  if (countryCode === 'SA' && digits.length === 9) return `966${digits}`;
  if (countryCode === 'QA' && digits.length === 8) return `974${digits}`;
  return '';
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
