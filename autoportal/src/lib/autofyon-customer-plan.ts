import { queryOne } from '@/lib/db';

export type AutofyonCustomerPlan = {
  plan: 'free' | 'paid';
  status: 'active' | 'suspended';
  paid_through: string | null;
};

export function hasActivePaidPlan(
  plan: Pick<AutofyonCustomerPlan, 'plan' | 'status' | 'paid_through'>,
  today = new Date().toISOString().slice(0, 10),
): boolean {
  return plan.plan === 'paid'
    && plan.status === 'active'
    && plan.paid_through !== null
    && plan.paid_through >= today;
}

export async function requiresAutofyonSponsorship(businessId: string): Promise<boolean> {
  const plan = await queryOne<AutofyonCustomerPlan>(
    `SELECT plan, status, paid_through FROM autofyon_customer_plans WHERE business_id = ?`,
    [businessId],
  );
  return !plan || !hasActivePaidPlan(plan);
}
