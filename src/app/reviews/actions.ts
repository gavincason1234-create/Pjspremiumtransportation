"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { ActionState } from "@/lib/actions";
import { hashIp } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { notifyOwner } from "@/lib/notify";
import { hoursAgoIso, rateLimit } from "@/lib/rate-limit";
import { currentIp } from "@/lib/request";
import { BUSINESS, siteUrl } from "@/lib/site";
import { serviceLabel } from "@/lib/types";
import type { Review } from "@/lib/types";
import { fieldErrors, formToObject, reviewSchema } from "@/lib/validation";

/** What the form receives back after a successful post. */
export interface SubmitReviewResult {
  /** True when the review is already visible on /reviews; false when it is waiting for the owner. */
  published: boolean;
  review: Review;
}

export type SubmitReviewState = ActionState<SubmitReviewResult>;

const HOUR_MS = 60 * 60 * 1000;
/** Short-window limit (in-memory, per instance) and the durable per-day cap checked against the database. */
const BURST_LIMIT = 3;
const DAILY_LIMIT = 3;

export async function submitReview(_prev: SubmitReviewState, formData: FormData): Promise<SubmitReviewState> {
  // 1. Honeypot. Riders never see the "website" field, so anything typed into it came from a bot.
  const trap = formData.get("website");
  if (typeof trap === "string" && trap.trim() !== "") {
    return { ok: false, message: "Submission rejected." };
  }

  // 2. Validate with the shared schema. A star rating that was never chosen arrives as a missing
  //    field; treating it as 0 lets the schema's own "Please choose a star rating." message surface.
  const raw = formToObject(formData);
  if (!raw.rating) raw.rating = "0";
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) };
  }

  // 3. Rate limiting: a quick in-memory check first, then a durable per-day check in the database.
  const ipHash = hashIp(await currentIp());
  const burst = rateLimit(`reviews:${ipHash}`, { limit: BURST_LIMIT, windowMs: HOUR_MS });
  if (!burst.ok) {
    return { ok: false, message: "You have posted a few reviews in a short time. Please try again in about an hour." };
  }

  try {
    const db = await getDb();
    const recent = await db.reviews.countRecentByIp(ipHash, hoursAgoIso(24));
    if (recent >= DAILY_LIMIT) {
      return {
        ok: false,
        message: `We have already received several reviews from your connection today. If you need to reach us, call or text ${BUSINESS.phone}.`,
      };
    }

    // 4. Publish right away, or hold for the owner, depending on the admin setting.
    const settings = await db.settings.get();
    const status = settings.reviewsRequireApproval ? "pending" : "approved";
    const input = parsed.data;
    const review = await db.reviews.create({
      name: input.name,
      rating: input.rating as Review["rating"],
      comment: input.comment,
      serviceType: input.serviceType ?? null,
      status,
      ipHash,
    });
    const published = status === "approved";

    // 5. Let the owner know after the response has been sent so the rider is not kept waiting.
    after(() =>
      notifyOwner({
        subject: `New ${review.rating}-star review from ${review.name}`,
        text: [
          `${review.name} left a ${review.rating}-star review${review.serviceType ? ` for a ${serviceLabel(review.serviceType)} ride` : ""}.`,
          `Status: ${published ? "published on the site" : "waiting for your approval"}`,
          "",
          review.comment,
          "",
          `Manage reviews: ${siteUrl()}/admin`,
        ].join("\n"),
      }),
    );

    revalidatePath("/reviews");
    revalidatePath("/");
    revalidatePath("/admin");

    return {
      ok: true,
      message: published ? "Your review is live." : "Your review has been received.",
      data: { published, review },
    };
  } catch (err) {
    console.error("[reviews] submitReview failed", err);
    return {
      ok: false,
      message: `Something went wrong on our end and your review was not saved. Please try again in a moment, or text it to us at ${BUSINESS.phone}.`,
    };
  }
}
