export const VENDOR_PROSPECT_CATEGORIES = [
  { id: 'dealer', label: 'Car dealer' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'authorized_agent', label: 'Authorized agent / manufacturer' },
  { id: 'distributor', label: 'Distributor' },
  { id: 'agent', label: 'Agent' },
  { id: 'parts_supplier', label: 'Parts supplier' },
  { id: 'service_center', label: 'Service / maintenance center' },
  { id: 'rental_company', label: 'Rental company' },
  { id: 'insurer', label: 'Insurance company' },
  { id: 'driving_school', label: 'Driving school' },
  { id: 'finance_company', label: 'Finance company' },
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'unclassified', label: 'Unclassified' },
] as const;

export const VENDOR_PROSPECT_STATUSES = [
  'new',
  'offer_ready',
  'queued',
  'contacted',
  'accepted',
  'declined',
  'do_not_contact',
] as const;

export type VendorProspectStatus = typeof VENDOR_PROSPECT_STATUSES[number];

export const VENDOR_PROSPECT_STATUS_LABELS: Record<VendorProspectStatus, string> = {
  new: 'New',
  offer_ready: 'Free offer eligible',
  queued: 'Queued for admin contact',
  contacted: 'Contacted manually',
  accepted: 'Accepted',
  declined: 'Declined',
  do_not_contact: 'Do not contact',
};
