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
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || `"vent2corp" <onboarding@resend.dev>`;

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
    // 1. Direct Resend HTTPS API (Primary Engine)
    if (resendApiKey) {
      console.log(`[RESEND EMAIL DISPATCH] Triggering Resend HTTP API for: ${toEmail}`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: from.includes("resend.dev") ? "vent2corp <onboarding@resend.dev>" : from,
          to: [toEmail],
          subject: `${otpCode} is your vent2corp verification code`,
          html: htmlTemplate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        console.log(`[RESEND API LIVE EMAIL SENT SUCCESS] to: ${toEmail} | Email ID: ${data.id}`);
        return { success: true, messageId: data.id };
      } else {
        const errorMsg = data.message || data.error?.message || "Resend API failed to deliver email.";
        console.error(`[RESEND API ERROR]`, data);
        return { success: false, error: errorMsg };
      }
    }

    // 2. Custom SMTP Transporter (Fallback if SMTP_HOST configured)
    if (host && user && pass) {
      console.log(`[SMTP EMAIL DISPATCH] Triggering Custom SMTP (${host}:${port}) for: ${toEmail}`);
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

      console.log(`[SMTP EMAIL SENT SUCCESS] to: ${toEmail} | Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }

    console.error(`[EMAIL ERROR] RESEND_API_KEY is not configured in .env.local`);
    return { success: false, error: "RESEND_API_KEY is missing in environment settings." };
  } catch (error) {
    console.error(`[EMAIL DISPATCH ERROR] Failed to send email to ${toEmail}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email." };
  }
}
