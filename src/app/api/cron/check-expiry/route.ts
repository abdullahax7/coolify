import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // 1. Auth check for CRON (could use a secret header)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  // 2. Find custom properties expiring in the next 7 days
  const { data: expiringSoon, error } = await admin
    .from('custom_properties')
    .select('*, profiles(email, name)')
    .gt('expires_at', new Date().toISOString())
    .lt('expires_at', sevenDaysFromNow.toISOString())
    .eq('is_approved', true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = [];

  // 3. Send notifications
  for (const prop of (expiringSoon || [])) {
    const userEmail = prop.profiles?.email;
    const userName = prop.profiles?.name || 'Valued Member';

    if (userEmail) {
      const { success } = await sendEmail({
        to: userEmail,
        subject: `Your property listing is expiring soon: ${prop.title}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;">
            <h2 style="color:#e11d48;">Listing Expiry Reminder</h2>
            <p>Hi ${userName},</p>
            <p>This is a friendly reminder that your property listing <strong>${prop.title}</strong> is set to expire on <strong>${new Date(prop.expires_at).toLocaleDateString('en-GB')}</strong>.</p>
            <p>To keep your property live on our site, please renew your listing plan via the dashboard.</p>
            <div style="margin-top:24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background:#e11d48;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">Renew Now</a>
            </div>
            <p style="margin-top:24px;color:#64748b;font-size:0.875rem;">If you've already renewed, please ignore this email.</p>
          </div>
        `
      });
      results.push({ id: prop.id, success });
    }
  }

  return NextResponse.json({ processed: results.length, details: results });
}
