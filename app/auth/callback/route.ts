import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    // Exchange the code for a session – this sets the auth cookie
    await supabase.auth.exchangeCodeForSession(code);
  }

  // After successful login, redirect to dashboard (or home)
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
