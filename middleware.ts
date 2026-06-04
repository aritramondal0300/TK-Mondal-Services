import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/login (login API)
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon-light-32x32.png, icon-dark-32x32.png, icon.svg, apple-icon.png (public assets)
     */
    '/((?!api/login|login|_next/static|_next/image|favicon.ico|icon-light-32x32\\.png|icon-dark-32x32\\.png|icon\\.svg|apple-icon\\.png).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // Use a secret key from environment or fallback
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-me-tkm-services';
  
  // Verify token
  const username = await verifyToken(token, jwtSecret);

  if (!username) {
    // If it's an API route (other than api/login which is already excluded in matcher), return 401 Unauthorized
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Otherwise redirect pages to /login
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/' && pathname !== '') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
