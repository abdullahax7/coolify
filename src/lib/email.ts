import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html, replyTo }: { to: string; subject: string; html: string; replyTo?: string }) {
  try {
    const info = await transporter.sendMail({
      from: `"Property Trader" <${process.env.SMTP_USER}>`,
      to,
      replyTo,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}

export function getWelcomeEmailHtml(name: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:8px;">
      <div style="background:#e11d48;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:1.5rem;">Welcome to Property Trader!</h1>
      </div>
      <div style="background:white;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
        <p>Hi ${name},</p>
        <p>Thanks for joining Property Trader. Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>List your properties for sale or rent</li>
          <li>Purchase professional property services</li>
          <li>Manage your compliance documents</li>
        </ul>
        <div style="text-align:center;margin-top:32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://propertytrader1.co.uk'}/dashboard" 
             style="background:#e11d48;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  `;
}
