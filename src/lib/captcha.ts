export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // secret not configured — skip
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  });
  const json = await res.json() as { success: boolean };
  return json.success === true;
}

export function captchaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true';
}
