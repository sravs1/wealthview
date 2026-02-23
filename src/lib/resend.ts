import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sender address — use your verified Resend domain, or onboarding@resend.dev for testing
const FROM = "Wealthview <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Wealthview!",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#050a14;color:#f8fafc;padding:40px 32px;border-radius:16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
          <div style="width:36px;height:36px;background:#10b981;border-radius:10px;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:18px;font-weight:bold;">W</span>
          </div>
          <span style="font-size:18px;font-weight:600;color:white;">Wealth<span style="color:#34d399">view</span></span>
        </div>

        <h1 style="font-size:24px;font-weight:700;color:white;margin:0 0 12px;">
          Welcome, ${name}! 👋
        </h1>
        <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Your account is ready. Start by connecting your first exchange to see your entire portfolio in one place.
        </p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/exchanges"
           style="display:inline-block;background:#10b981;color:white;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;margin-bottom:32px;">
          Connect your first exchange →
        </a>

        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />

        <p style="color:#475569;font-size:13px;margin:0;">
          You're receiving this because you signed up for Wealthview.<br/>
          Questions? Reply to this email and we'll help.
        </p>
      </div>
    `,
  });
}
