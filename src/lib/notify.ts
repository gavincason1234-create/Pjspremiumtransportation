import { BUSINESS } from "@/lib/site";

/**
 * Owner notifications. If RESEND_API_KEY + NOTIFY_EMAIL are configured, sends an email through Resend;
 * otherwise logs to the server console so nothing is silently lost. Never throws.
 * Call from route handlers/actions inside `after(() => notifyOwner(...))` so responses stay fast.
 */
export async function notifyOwner(input: { subject: string; text: string }): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || BUSINESS.email;
  const from = process.env.NOTIFY_FROM || `${BUSINESS.name} <onboarding@resend.dev>`;
  const subject = `[${BUSINESS.shortName}] ${input.subject}`;

  if (!apiKey) {
    console.log(`[notify] (email not configured) ${subject}\n${input.text}`);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: input.text }),
    });
    if (!res.ok) {
      console.error(`[notify] Resend responded ${res.status}: ${await res.text()}`);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[notify] failed", err);
    return { sent: false };
  }
}
