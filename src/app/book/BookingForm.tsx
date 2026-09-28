"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Copy, MessageSquareText, Phone, RotateCcw } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Honeypot, Input, Select, Textarea } from "@/components/ui/Field";
import { idleState } from "@/lib/actions";
import { cn } from "@/lib/cn";
import { formatDateTime, formatPhone } from "@/lib/format";
import { BUSINESS, smsHref } from "@/lib/site";
import { SERVICE_TYPES, type Booking, type ServiceType } from "@/lib/types";
import { submitBooking } from "./actions";
import type { BookingActionState } from "./types";
import { useMinPickup } from "./useMinPickup";

/** Destinations riders ask for most. One tap fills the drop-off field; the rider can still edit it. */
const QUICK_DESTINATIONS: { short: string; full: string }[] = [
  { short: "DFW Airport", full: "DFW International Airport" },
  { short: "Love Field", full: "Dallas Love Field Airport" },
  { short: "WinStar", full: "WinStar World Casino & Resort, Thackerville, OK" },
];

const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export function BookingForm({ defaultService, className }: { defaultService: ServiceType; className?: string }) {
  // "Request another ride" remounts the whole thing so useActionState and every field start fresh.
  const [instance, setInstance] = useState(0);
  return (
    <BookingFormInstance
      key={instance}
      defaultService={defaultService}
      className={className}
      onReset={() => setInstance((n) => n + 1)}
    />
  );
}

function BookingFormInstance({ defaultService, className, onReset }: { defaultService: ServiceType; className?: string; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<BookingActionState, FormData>(submitBooking, idleState);
  const booking = state.ok ? state.data?.booking : undefined;
  const liveText = pending ? "Sending your request." : (state.message ?? "");

  return (
    <div className={className}>
      {/* One persistent live region so both errors and the confirmation are announced. */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveText}
      </p>
      {booking ? (
        <Confirmation booking={booking} onReset={onReset} />
      ) : (
        <RequestForm state={state} formAction={formAction} pending={pending} defaultService={defaultService} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ the form */

function RequestForm({
  state,
  formAction,
  pending,
  defaultService,
}: {
  state: BookingActionState;
  formAction: (formData: FormData) => void;
  pending: boolean;
  defaultService: ServiceType;
}) {
  const fields = state.fields ?? {};
  const values = state.data?.values ?? {};
  const formError = !state.ok && state.message ? state.message : null;
  const isFieldError = Boolean(state.fields && Object.keys(state.fields).length > 0);
  const minPickup = useMinPickup();

  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // After a response, put keyboard and screen-reader users where the problem is.
  useEffect(() => {
    if (state.ok || !state.message) return;
    if (isFieldError) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    } else {
      alertRef.current?.focus();
    }
  }, [state, isFieldError]);

  function fillDropoff(text: string) {
    const el = formRef.current?.elements.namedItem("dropoffAddress");
    if (!(el instanceof HTMLInputElement)) return;
    el.value = text;
    el.focus();
  }

  return (
    <Card>
      <CardBody className="sm:p-8">
        {/* Remount on every server response so preserved values apply cleanly to every field (React resets
            the form after an action completes; selects in particular do not pick up a changed defaultValue). */}
        <form ref={formRef} action={formAction} key={state.data?.respondedAt ?? "initial"} className="relative space-y-8">
          {formError && (
            <div ref={alertRef} tabIndex={-1} className="outline-none">
              <Alert tone="danger" title={isFieldError ? "A few details need attention" : "We couldn't send that request"}>
                <p>{formError}</p>
                {!isFieldError && (
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
                    <a href={BUSINESS.phoneHref} className="inline-flex min-h-11 items-center gap-1.5 text-gold-300 underline-offset-4 hover:underline">
                      <Phone className="size-4" aria-hidden="true" /> Call {BUSINESS.phone}
                    </a>
                    <a href={BUSINESS.smsHref} className="inline-flex min-h-11 items-center gap-1.5 text-gold-300 underline-offset-4 hover:underline">
                      <MessageSquareText className="size-4" aria-hidden="true" /> Text us
                    </a>
                  </p>
                )}
              </Alert>
            </div>
          )}

          <fieldset disabled={pending} className="min-w-0 space-y-5">
            <legend className="mb-5">
              <span className="block font-display text-xl text-cream-50">Trip details</span>
              <span className="mt-1 block text-sm text-ink-400">Where you are starting, where you are headed, and when.</span>
            </legend>

            <Select
              id="serviceType"
              name="serviceType"
              label="Service"
              defaultValue={values.serviceType ?? defaultService}
              error={fields.serviceType}
              autoComplete="off"
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Input
              id="pickupAddress"
              name="pickupAddress"
              label="Pickup address"
              placeholder="Street address, city"
              autoComplete="street-address"
              defaultValue={values.pickupAddress ?? ""}
              error={fields.pickupAddress}
              maxLength={200}
              required
            />

            <div>
              <Input
                id="dropoffAddress"
                name="dropoffAddress"
                label="Drop-off address"
                placeholder="Airport, terminal, clinic, venue or street address"
                autoComplete="street-address"
                defaultValue={values.dropoffAddress ?? ""}
                error={fields.dropoffAddress}
                maxLength={200}
                required
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-2" role="group" aria-label="Quick fill drop-off">
                <span className="text-xs text-ink-500">Quick fill</span>
                {QUICK_DESTINATIONS.map((d) => (
                  <button
                    key={d.full}
                    type="button"
                    onClick={() => fillDropoff(d.full)}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink-600 px-3.5 text-xs font-semibold text-ink-200 transition-colors hover:border-gold-500/60 hover:text-cream-50"
                  >
                    {d.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="pickupAt"
                name="pickupAt"
                type="datetime-local"
                label="Pickup date and time"
                hint="Central Time"
                min={minPickup}
                defaultValue={values.pickupAt ?? ""}
                error={fields.pickupAt}
                help="Flying? Add your flight number in the notes and Patsy will plan around it."
                required
              />
              <Select id="passengers" name="passengers" label="Passengers" defaultValue={values.passengers ?? "1"} error={fields.passengers}>
                {PASSENGER_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "passenger" : "passengers"}
                  </option>
                ))}
              </Select>
            </div>
          </fieldset>

          <fieldset disabled={pending} className="min-w-0 space-y-5">
            <legend className="mb-5">
              <span className="block font-display text-xl text-cream-50">About you</span>
              <span className="mt-1 block text-sm text-ink-400">So Patsy knows who she is picking up and how to reach you.</span>
            </legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="name"
                name="name"
                label="Your name"
                autoComplete="name"
                defaultValue={values.name ?? ""}
                error={fields.name}
                maxLength={80}
                required
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Mobile phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(940) 555-0123"
                defaultValue={values.phone ?? ""}
                error={fields.phone}
                help="We confirm by text or call."
                maxLength={25}
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              hint="(optional)"
              autoComplete="email"
              inputMode="email"
              defaultValue={values.email ?? ""}
              error={fields.email}
            />

            <Textarea
              id="notes"
              name="notes"
              label="Notes"
              hint="(optional)"
              help="Flight number, gate, mobility needs, pets, anything we should know."
              rows={4}
              maxLength={600}
              defaultValue={values.notes ?? ""}
              error={fields.notes}
            />
          </fieldset>

          <Honeypot />

          <div>
            <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
              {pending ? "Sending your request" : "Request this ride"}
            </Button>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">No payment now. Patsy confirms availability and price by text or call.</p>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ success */

function Confirmation({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const firstName = booking.name.trim().split(/\s+/)[0] || booking.name;
  const service = SERVICE_TYPES.find((s) => s.value === booking.serviceType)?.label ?? booking.serviceType;
  const when = `${formatDateTime(booking.pickupAt, { withYear: true })} (Central)`;
  const textBody = `Hi Patsy, this is ${booking.name}. I just sent ride request ${booking.code}.`;

  const rows: { term: string; value: string }[] = [
    { term: "Service", value: service },
    { term: "Pickup", value: booking.pickupAddress },
    { term: "Drop-off", value: booking.dropoffAddress },
    { term: "Date and time", value: when },
    { term: "Passengers", value: String(booking.passengers) },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="hairline-gold" aria-hidden="true" />
      <CardBody className="sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-500/50" aria-hidden="true">
            <Check className="size-7 text-gold-300" strokeWidth={2.5} />
          </span>
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl leading-tight text-cream-50 outline-none sm:text-4xl">
              Request received
            </h2>
            <p className="mt-1.5 text-ink-300">Thanks, {firstName}. Patsy has your request and will be in touch shortly.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gold-500/30 bg-ink-900 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">Confirmation code</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="select-all font-mono text-3xl tracking-[0.12em] text-cream-50 sm:text-4xl">{booking.code}</p>
            <CopyButton text={booking.code} />
          </div>
          <p className="mt-2 text-sm text-ink-400">Keep this handy. It is the quickest way to reference your ride when you text or call.</p>
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.term} className={cn("min-w-0", (r.term === "Pickup" || r.term === "Drop-off") && "sm:col-span-2")}>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">{r.term}</dt>
              <dd className="mt-1 break-words text-[15px] text-cream-100">{r.value}</dd>
            </div>
          ))}
        </dl>

        <Alert tone="info" className="mt-6">
          We will text or call <strong className="font-semibold text-cream-50">{formatPhone(booking.phone)}</strong> to confirm availability and price. Nothing is charged now.
        </Alert>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={BUSINESS.phoneHref} variant="outline-gold">
            <Phone className="size-4" aria-hidden="true" /> Call {BUSINESS.ownerFirstName}
          </ButtonLink>
          <ButtonLink href={smsHref(BUSINESS.phone, textBody)} variant="secondary">
            <MessageSquareText className="size-4" aria-hidden="true" /> Text
          </ButtonLink>
          <Button type="button" variant="ghost" onClick={onReset}>
            <RotateCcw className="size-4" aria-hidden="true" /> Request another ride
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (older browser or insecure context). The code is selectable text, so no harm done.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-600 px-4 text-sm font-semibold text-cream-100 transition-colors hover:border-gold-500/60 hover:bg-white/5"
      aria-label={copied ? "Copied" : `Copy confirmation code ${text}`}
    >
      {copied ? <Check className="size-4 text-success-400" aria-hidden="true" /> : <Copy className="size-4 text-gold-400" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
