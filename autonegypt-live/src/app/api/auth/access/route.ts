import { NextRequest, NextResponse } from 'next/server';

/**
 * Direct backdoor access has been permanently disabled for production security.
 * All administrators and showroom managers must authenticate via /login using their
 * verified email and password.
 */
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/login?error=auth_required', req.url));
}
