import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminUser } from '@/lib/admin-auth';
import PlatformAnnouncementsAdmin from '@/components/PlatformAnnouncementsAdmin';

export const dynamic = 'force-dynamic';

export default async function PlatformAnnouncementsPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/announcements', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <Link href="/admin/platform/carousel" className="hover:underline">Carousel studio</Link><span>/</span>
        <span>Global announcements</span>
      </nav>
      <PlatformAnnouncementsAdmin />
    </div>
  );
}
