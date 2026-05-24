import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the auth_token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Set to epoch to delete the cookie
    });

    return response;
  } catch (error: any) {
    console.error('Logout API failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
