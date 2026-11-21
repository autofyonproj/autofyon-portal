export const VENDOR_LEAD_BUSINESS_TYPES = [
  'main_agency',
  'distributor',
  'showroom',
  'agent_broker',
  'used_car_dealer',
  'service_center',
  'spare_parts',
  'accessories_detailing',
  'rental_company',
  'insurance_company',
  'finance_bank',
  'leasing_company',
  'driving_school',
  'manufacturer',
] as const;

export const VENDOR_LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'visit_or_quote',
  'won',
  'lost',
] as const;

export type VendorLeadStatus = typeof VENDOR_LEAD_STATUSES[number];

export function isVendorLeadBusinessType(typeId: unknown): boolean {
  return typeof typeId === 'string'
    && (VENDOR_LEAD_BUSINESS_TYPES as readonly string[]).includes(typeId);
}

export function isValidLeadDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
