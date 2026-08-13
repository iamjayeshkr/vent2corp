import nodemailer from "nodemailer";

interface SendEmailParams {
  toEmail: string;
  userName: string;
  otpCode: string;
}

export async function sendVerificationEmail({
  toEmail,
  userName,
  otpCode,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const host = process.env.SMTP_HOST?.trim() || (resendApiKey ? "smtp.resend.com" : undefined);
  const port = parseInt(process.env.SMTP_PORT || (resendApiKey ? "465" : "587"), 10);
  const user = process.env.SMTP_USER?.trim() || (resendApiKey ? "resend" : undefined);
  const pass = process.env.SMTP_PASS?.trim() || resendApiKey;
  const from = process.env.SMTP_FROM?.trim() || (resendApiKey ? `"vent2corp" <onboarding@resend.dev>` : `"vent2corp" <no-reply@vent2corp.com>`);

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 520px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 20px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .logo { font-family: monospace; font-size: 20px; font-weight: bold; color: #f4f4f5; text-decoration: none; margin-bottom: 24px; display: inline-block; }
    .logo span { color: #10b981; }
    h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
    .otp-box { background-color: #09090b; border: 1px solid #10b981; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .otp-code { font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #10b981; margin: 0; }
    .expiry { font-size: 12px; color: #71717a; margin-top: 8px; font-family: monospace; }
    .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; border-t: 1px solid #27272a; pt: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <a href="#" class="logo">vent<span>2corp</span></a>
    <h1>Verify Your Email Address</h1>
    <p>Hi ${userName || "there"},</p>
    <p>Thank you for creating an account on <strong>vent2corp</strong>. Please enter the following 6-digit verification code to activate your account and access AI translation features:</p>
    
    <div class="otp-box">
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">Expires in 10 minutes · Do not share this code</div>
    </div>
    
    <p style="font-size: 12px; color: #71717a;">If you did not request this email, please ignore it or contact support.</p>
    
    <div class="footer">
      vent2corp AI Intelligence Engine · Automated Security Notification
    </div>
  </div>
</body>
</html>
  `;

  try {
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from,
        to: toEmail,
        subject: `${otpCode} is your vent2corp verification code`,
        text: `Your vent2corp verification code is: ${otpCode}. It expires in 10 minutes.`,
        html: htmlTemplate,
      });

      console.log(`[SMTP PRODUCTION EMAIL SENT SUCCESS] to: ${toEmail} | Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`\n======================================================`);
      console.log(`[DEV SMTP SIMULATOR] Email verification triggered for: ${toEmail}`);
      console.log(`OTP VERIFICATION CODE: ${otpCode}`);
      console.log(`\n⚠️ WHY ARE YOU SEEING THIS IN CONSOLE?`);
      console.log(`Neither SMTP_HOST/USER/PASS nor RESEND_API_KEY are configured in .env.local.`);
      console.log(`Add RESEND_API_KEY=re_your_api_key in .env.local for live inbox delivery!`);
      console.log(`======================================================\n`);
      return { success: true };
    }
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${toEmail}:`, error);
    return { success: false };
  }
}
