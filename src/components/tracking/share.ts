/** Browser-only helpers for handing a trip link to someone else. Call from event handlers only. */

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/** Copies text, falling back to a hidden textarea where the async Clipboard API is unavailable (older browsers, plain http). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Opens the phone's share sheet when there is one, otherwise copies the link. */
export async function shareOrCopy(data: { url: string; title: string; text: string }): Promise<ShareOutcome> {
  if (typeof navigator.share === "function") {
    const payload: ShareData = { title: data.title, text: data.text, url: data.url };
    if (typeof navigator.canShare !== "function" || navigator.canShare(payload)) {
      try {
        await navigator.share(payload);
        return "shared";
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
        // Some desktop browsers expose share() but refuse it; copying is the honest fallback.
      }
    }
  }
  return (await copyText(data.url)) ? "copied" : "failed";
}

/** sms: link with only a body, so the driver picks the rider from their own contacts. Works on iOS and Android. */
export function smsBodyHref(body: string): string {
  return `sms:?&body=${encodeURIComponent(body)}`;
}
