export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // Fail closed: if captcha is enabled but the secret is missing in this
  // environment, do NOT silently accept requests. Misconfiguration must be
  // visible, not bypassable.
  if (!secret) {
    if (captchaEnabled()) {
      console.error('[captcha] RECAPTCHA_SECRET_KEY missing while captcha is enabled — rejecting');
      return false;
    }
    return true;
  }
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const json = await res.json() as { success: boolean };
    return json.success === true;
  } catch (err) {
    console.error('[captcha] verify failed:', err);
    return false;
  }
}

export function captchaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true';
}
