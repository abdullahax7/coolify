import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * This route handles the default Supabase 'auth/v1/verify' path.
 * If Supabase is configured with the site URL, it may send links to this path.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('redirect_to') ?? '/dashboard';

  if (token && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token,
    });
    
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Redirect to login with error
  return NextResponse.redirect(new URL('/login?error=Verification failed', request.url));
}
