import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface D1Database {
  prepare(query: string): {
    bind(...values: string[]): {
      first<T>(): Promise<T | null>;
    };
  };
}

/**
 * Resolve managed minisite domains through D1 and keep the portal host intact.
 */
export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get('host');
  const host = new URL(`http://${hostHeader || req.nextUrl.hostname}`).hostname
    .toLowerCase()
    .replace(/\.$/, '');
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete('x-autofyon-site-presentation');

  // Keep the portal and its admin routes available on portal hosts
  // and on local development hosts.
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === 'autofyon.com' ||
    host === 'www.autofyon.com'
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ── 1. Edge Security Gate: Strict Admin & Contact Database Protection ─────
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProtectedApiPath =
    (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') ||
    pathname.startsWith('/api/contacts/');

  if (isAdminPath || isProtectedApiPath) {
    const sessionCookie = req.cookies.get('admin_session')?.value;
    const cfEmail = req.headers.get('cf-access-authenticated-user-email');

    // If neither signed admin session cookie nor Cloudflare Access header is present:
    if (!sessionCookie && !cfEmail) {
      if (isAdminPath) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json(
        { error: 'unauthorized: platform admin session required' },
        { status: 401 },
      );
    }
  }

  // Pass-through for assets, API routes, and login on any host
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/almostashar') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const domainCandidates = host.startsWith('www.')
    ? [host, host.slice(4)]
    : [host, `www.${host}`];
  const { env } = getCloudflareContext();
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) {
    throw new Error('D1 binding "DB" is not available for custom-domain routing.');
  }

  let site: { slug: string } | null = null;
  try {
    site = await db
      .prepare(
        `SELECT slug FROM businesses
          WHERE lower(custom_domain) IN (?, ?)
            AND published = 1 AND status = 'active'
          LIMIT 1`,
      )
      .bind(...domainCandidates)
      .first<{ slug: string }>();
  } catch (err) {
    console.error('Edge custom-domain lookup failed:', err);
  }

  if (!site) return NextResponse.next({ request: { headers: requestHeaders } });

  const url = req.nextUrl.clone();
  const englishPrefix = /^\/en(?:\/|$)/.test(pathname);
  const suffix = englishPrefix ? pathname.slice(3) : pathname;
  url.pathname = englishPrefix
    ? `/en/${site.slug}${suffix}`
    : `/${site.slug}${pathname === '/' ? '' : pathname}`;
  requestHeaders.set('x-autofyon-site-presentation', 'custom-domain');
  
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  // Resilience: Edge caching with stale-while-revalidate & stale-if-error
  // Ensures paid client sites stay online even during portal maintenance or transient DB hiccups
  response.headers.set(
    'Cache-Control',
    'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=604800'
  );
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
