"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { StarInput } from "@/components/ui/StarInput";
import { idleState } from "@/lib/actions";
import { BUSINESS } from "@/lib/site";
import { SERVICE_TYPES } from "@/lib/types";
import { submitReview } from "./actions";

const COMMENT_MAX = 1200;
/** Visual order of the fields, used to move focus to the first one with an error. */
const FIELD_ORDER = ["rating", "name", "serviceType", "comment"] as const;

export function ReviewForm({ requiresApproval }: { requiresApproval: boolean }) {
  const [state, formAction, pending] = useActionState(submitReview, idleState);
  // Controlled so a server-side validation error never wipes what the rider typed.
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [comment, setComment] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const failed = !state.ok && Boolean(state.message || state.fields);

  // After each round trip, put focus on what changed: the success panel, the first field with an
  // error, or the form-level message. Keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (state.ok) {
      successRef.current?.focus();
      return;
    }
    if (!state.message && !state.fields) return;
    const form = formRef.current;
    if (!form) return;
    const firstBad = FIELD_ORDER.find((key) => state.fields?.[key]);
    const target = firstBad ? form.querySelector<HTMLElement>(`[name="${firstBad}"]`) : alertRef.current;
    target?.focus();
  }, [state]);

  const liveStatus = pending
    ? "Posting your review."
    : state.ok
      ? "Your review was posted."
      : failed
        ? "Your review was not posted. Please check the form."
        : "";

  if (state.ok && state.data) {
    const { published, review } = state.data;
    return (
      <div>
        <p className="sr-only" role="status" aria-live="polite">
          {liveStatus}
        </p>
        <div
          ref={successRef}
          tabIndex={-1}
          className="rounded-2xl border border-success-500/40 bg-success-500/10 p-5 outline-none sm:p-6"
        >
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-success-400" aria-hidden="true" />
            <div>
              <h3 className="font-display text-2xl leading-tight text-cream-50">
                {published ? (
                  <>Thank you &mdash; your review is live.</>
                ) : (
                  <>
                    Thank you &mdash; {BUSINESS.ownerFirstName} will read it and it will appear shortly.
                  </>
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                {published
                  ? `It is now showing in the list above, and ${BUSINESS.ownerFirstName} has been notified.`
                  : "Reviews are only checked for spam and abusive content. Honest feedback of any kind goes up as written."}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
              {published ? "Your review" : "Your review, as it will appear"}
            </p>
            <ReviewCard review={review} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {published && (
              <ButtonLink href="#reviews" variant="outline-gold" size="sm">
                See all reviews
              </ButtonLink>
            )}
            <ButtonLink href={BUSINESS.facebookUrl} variant="ghost" size="sm" external>
              Follow {BUSINESS.shortName} on Facebook
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="relative space-y-5">
      <p className="sr-only" role="status" aria-live="polite">
        {liveStatus}
      </p>

      {failed && state.message && (
        <div ref={alertRef} tabIndex={-1} className="rounded-xl outline-none">
          <Alert tone="danger" title="We could not post your review yet">
            {state.message}
          </Alert>
        </div>
      )}

      <StarInput name="rating" error={state.fields?.rating} />

      <Input
        id="review-name"
        name="name"
        label="Your name"
        hint="First name is fine"
        autoComplete="given-name"
        maxLength={60}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={state.fields?.name}
      />

      <Select
        id="review-service"
        name="serviceType"
        label="Which ride?"
        hint="optional"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        error={state.fields?.serviceType}
      >
        <option value="">Choose a ride type</option>
        {SERVICE_TYPES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <div>
        <Textarea
          id="review-comment"
          name="comment"
          label="Your review"
          rows={5}
          maxLength={COMMENT_MAX}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={state.fields?.comment}
          help="How the pickup went, how the ride felt, and whether you would book again."
        />
        <p className="mt-1.5 text-right text-xs tabular-nums text-ink-400">
          {comment.length.toLocaleString("en-US")} / {COMMENT_MAX.toLocaleString("en-US")}
        </p>
      </div>

      <Honeypot />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
          {pending ? "Posting…" : "Post my review"}
        </Button>
        <p className="text-xs text-ink-400">
          {requiresApproval
            ? `${BUSINESS.ownerFirstName} reads each review before it appears.`
            : "Your review appears on this page right away."}
        </p>
      </div>

      <p className="border-t border-white/5 pt-4 text-xs leading-relaxed text-ink-400">
        Reviews are written by riders. We do not pay for reviews or edit them, and the only content we remove is spam or abuse.
      </p>
    </form>
  );
}
