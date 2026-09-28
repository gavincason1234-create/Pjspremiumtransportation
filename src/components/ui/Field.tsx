import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const control =
  "block w-full rounded-xl border border-ink-600 bg-ink-900 px-3.5 py-3 text-[16px] text-cream-100 placeholder:text-ink-500 transition-colors focus:border-gold-500 focus:bg-ink-850 disabled:opacity-60 aria-[invalid=true]:border-danger-500";

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cream-100">
      {children}
      {hint && <span className="ml-1.5 font-normal text-ink-400">{hint}</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger-400" role="alert">
      {children}
    </p>
  );
}

export function Help({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-sm text-ink-400">{children}</p>;
}

type Common = { label: ReactNode; hint?: ReactNode; error?: string; help?: ReactNode; wrapperClassName?: string };

export function Input({ id, label, hint, error, help, wrapperClassName, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & Common & { id: string }) {
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <input id={id} className={cn(control, className)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {help && !error && <Help>{help}</Help>}
      <FieldError id={`${id}-err`}>{error}</FieldError>
    </div>
  );
}

export function Textarea({ id, label, hint, error, help, wrapperClassName, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & Common & { id: string }) {
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <textarea id={id} className={cn(control, "min-h-28 resize-y", className)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {help && !error && <Help>{help}</Help>}
      <FieldError id={`${id}-err`}>{error}</FieldError>
    </div>
  );
}

export function Select({ id, label, hint, error, help, wrapperClassName, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & Common & { id: string }) {
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <div className="relative">
        <select id={id} className={cn(control, "appearance-none pr-10", className)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest}>
          {children}
        </select>
        <svg className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
      {help && !error && <Help>{help}</Help>}
      <FieldError id={`${id}-err`}>{error}</FieldError>
    </div>
  );
}

/** Invisible anti-spam field. Bots fill it; the server rejects any non-empty value. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
