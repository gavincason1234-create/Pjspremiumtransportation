"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { CircleCheck, MessageSquareText, Phone } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Honeypot, Input, Textarea } from "@/components/ui/Field";
import { idleState } from "@/lib/actions";
import { formatPhone } from "@/lib/format";
import { BUSINESS, smsHref } from "@/lib/site";
import { submitApplication } from "./actions";

const MESSAGE_MAX = 600;

/** Visual order of the fields, used to move focus to the first one with an error. */
const FIELD_ORDER = ["name", "phone", "email", "licensePlate", "vehicle", "yearsDriving", "city", "message"] as const;
type Field = (typeof FIELD_ORDER)[number];
type Values = Record<Field, string>;

const EMPTY: Values = { name: "", phone: "", email: "", licensePlate: "", vehicle: "", yearsDriving: "", city: "", message: "" };

/** What happens after an application lands. Shared by the form footer and the success panel. */
const NEXT_STEPS = [
  { title: `${BUSINESS.ownerFirstName} reaches out`, body: "She reads every application herself and gets in touch by phone or text." },
  { title: "A short conversation and a ride-along", body: "Nothing formal. A talk about availability and the standard, then some time in the car together." },
  { title: "You are added to the driver console", body: "You get your own PIN for the driver console, where trips are started and riders can follow their pickup." },
];

export function ApplyForm() {
  const [state, formAction, pending] = useActionState(submitApplication, idleState);
  // Controlled so a server-side validation error never wipes what the applicant typed.
  const [values, setValues] = useState<Values>(EMPTY);
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

  const set = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValues((v) => ({ ...v, [field]: next }));
  };

  const liveStatus = pending
    ? "Sending your application."
    : state.ok
      ? "Your application was received."
      : failed
        ? "Your application was not sent. Please check the form."
        : "";

  if (state.ok && state.data) {
    const { application } = state.data;
    const firstName = application.name.trim().split(/\s+/)[0];
    const textBody = `Hi ${BUSINESS.ownerFirstName}, I just sent a driver application under the name ${application.name}.`;
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
              <h3 className="font-display text-2xl leading-tight text-cream-50">Application received</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Thank you, {firstName}. {BUSINESS.ownerFirstName} has your name and plate, and she has been notified. There is nothing else to
                send right now.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-xl border border-white/10 bg-ink-900/60 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Name</dt>
              <dd className="mt-0.5 text-cream-100">{application.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Phone</dt>
              <dd className="mt-0.5 text-cream-100">{formatPhone(application.phone)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Plate</dt>
              <dd className="mt-0.5 font-semibold tracking-wide text-cream-100">{application.licensePlate}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Vehicle</dt>
              <dd className="mt-0.5 text-cream-100">{application.vehicle}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">What happens next</p>
            <ol className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 text-xs font-semibold text-gold-300"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-cream-50">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-300">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={BUSINESS.phoneHref} variant="outline-gold" className="w-full sm:w-auto">
              <Phone className="size-4" aria-hidden="true" /> Call {BUSINESS.ownerFirstName}
            </ButtonLink>
            <ButtonLink href={smsHref(BUSINESS.phone, textBody)} variant="ghost" className="w-full sm:w-auto">
              <MessageSquareText className="size-4 text-gold-400" aria-hidden="true" /> Text {BUSINESS.phone}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardBody>
        <form ref={formRef} action={formAction} noValidate className="relative space-y-8">
          <p className="sr-only" role="status" aria-live="polite">
            {liveStatus}
          </p>

          {failed && state.message && (
            <div ref={alertRef} tabIndex={-1} className="rounded-xl outline-none">
              <Alert tone="danger" title="We could not send your application yet">
                {state.message}
              </Alert>
            </div>
          )}

          <fieldset className="min-w-0">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">About you</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="apply-name"
                name="name"
                label="Your name"
                autoComplete="name"
                maxLength={80}
                required
                value={values.name}
                onChange={set("name")}
                error={state.fields?.name}
              />
              <Input
                id="apply-phone"
                name="phone"
                type="tel"
                label="Phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(940) 555-0123"
                maxLength={25}
                required
                value={values.phone}
                onChange={set("phone")}
                error={state.fields?.phone}
              />
              <Input
                id="apply-email"
                name="email"
                type="email"
                label="Email"
                hint="optional"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                value={values.email}
                onChange={set("email")}
                error={state.fields?.email}
                wrapperClassName="sm:col-span-2"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">What you drive</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="apply-plate"
                name="licensePlate"
                label="License plate"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                placeholder="ABC-1234"
                maxLength={12}
                required
                value={values.licensePlate}
                onChange={set("licensePlate")}
                error={state.fields?.licensePlate}
                className="uppercase tracking-wider"
              />
              <Input
                id="apply-vehicle"
                name="vehicle"
                label="Vehicle"
                autoComplete="off"
                placeholder="2021 Cadillac XT5, black"
                maxLength={80}
                required
                value={values.vehicle}
                onChange={set("vehicle")}
                error={state.fields?.vehicle}
                help="Year, make, model and color."
              />
              <Input
                id="apply-years"
                name="yearsDriving"
                type="number"
                label="Years of driving experience"
                hint="optional"
                inputMode="numeric"
                min={0}
                max={80}
                step={1}
                placeholder="10"
                value={values.yearsDriving}
                onChange={set("yearsDriving")}
                error={state.fields?.yearsDriving}
                className="no-spinner"
                wrapperClassName="sm:max-w-xs"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">A little more</legend>
            <div className="space-y-5">
              <Input
                id="apply-city"
                name="city"
                label="City or town"
                hint="optional"
                autoComplete="address-level2"
                placeholder="Myra, Gainesville, Denton"
                maxLength={80}
                value={values.city}
                onChange={set("city")}
                error={state.fields?.city}
                wrapperClassName="sm:max-w-sm"
              />
              <div>
                <Textarea
                  id="apply-message"
                  name="message"
                  label="Message"
                  hint="optional"
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  value={values.message}
                  onChange={set("message")}
                  error={state.fields?.message}
                  help={`Availability, experience, anything you want ${BUSINESS.ownerFirstName} to know.`}
                />
                <p className="mt-1.5 text-right text-xs tabular-nums text-ink-400">
                  {values.message.length.toLocaleString("en-US")} / {MESSAGE_MAX.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </fieldset>

          <Honeypot />

          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
                {pending ? "Sending…" : "Send my application"}
              </Button>
              <p className="text-xs text-ink-400">Nothing to upload. {BUSINESS.ownerFirstName} follows up personally.</p>
            </div>
            <p className="text-xs leading-relaxed text-ink-400">
              By sending this, you agree that {BUSINESS.shortName} may contact you about driving. Your details are used for that purpose only.
            </p>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
