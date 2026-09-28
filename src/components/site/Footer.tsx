import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon } from "./FacebookIcon";
import { Logo } from "./Logo";
import { BUSINESS } from "@/lib/site";

const explore = [
  { href: "/services", label: "Services" },
  { href: "/book", label: "Reserve a ride" },
  { href: "/reviews", label: "Rider reviews" },
  { href: "/track", label: "Track a ride" },
  { href: "/drive", label: "Drive with us" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/driver", label: "Driver console" },
  { href: "/admin", label: "Owner sign-in" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-ink-900">
      <div className="hairline-gold" aria-hidden="true" />
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo size={44} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
            {BUSINESS.tagline} Woman-owned and locally operated in {BUSINESS.city}, Texas.
          </p>
          <a
            href={BUSINESS.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cream-100 hover:text-gold-300"
          >
            <FacebookIcon className="size-4 text-gold-400" />
            Follow us on Facebook
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-300 hover:text-cream-50">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">Reach us</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-300">
            <li>
              <a href={BUSINESS.phoneHref} className="inline-flex items-center gap-2 hover:text-cream-50">
                <Phone className="size-4 text-gold-400" aria-hidden="true" /> {BUSINESS.phone}
              </a>
              <span className="block pl-6 text-xs text-ink-500">Call or text to reserve</span>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center gap-2 break-all hover:text-cream-50">
                <Mail className="size-4 text-gold-400" aria-hidden="true" /> {BUSINESS.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>{BUSINESS.serviceArea}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">More</h2>
          <ul className="mt-4 space-y-2.5">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-300 hover:text-cream-50">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p>Reservations only · Airport · Medical · WinStar · Metroplex</p>
        </div>
      </div>
    </footer>
  );
}
