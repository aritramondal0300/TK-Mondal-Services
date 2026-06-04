import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { username, password } = body;

    // Retrieve environment variables
    let adminUser = process.env.ADMIN_USER;
    let adminPassword = process.env.ADMIN_PASSWORD;
    let jwtSecret = process.env.JWT_SECRET;

    // Fallback to Cloudflare request context environment variables if process.env is empty/missing
    try {
      const ctx = getRequestContext();
      if (ctx?.env) {
        adminUser = adminUser || (ctx.env as any).ADMIN_USER;
        adminPassword = adminPassword || (ctx.env as any).ADMIN_PASSWORD;
        jwtSecret = jwtSecret || (ctx.env as any).JWT_SECRET;
      }
    } catch (e) {
      // Ignore if getRequestContext fails (e.g. during local dev outside edge context)
    }

    // Default fallbacks for development/easy testing
    adminUser = adminUser || 'admin';
    adminPassword = adminPassword || 'admin';
    jwtSecret = jwtSecret || 'fallback-secret-key-change-me-tkm-services';

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username === adminUser && password === adminPassword) {
      const token = await signToken(username, jwtSecret);
      
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid ID or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Login API failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
