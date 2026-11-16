import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAutofyonMaster } from '@/lib/admin-auth';
import MasterCopiesClient from './MasterCopiesClient';

export const dynamic = 'force-dynamic';

export default async function MasterCopiesPage() {
  const requestHeaders = await headers();
  const request = new Request('https://autofyon.com/admin/master-copies', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const auth = await requireAutofyonMaster(request);
  if (auth instanceof Response) redirect('/admin');

  return <MasterCopiesClient />;
}
