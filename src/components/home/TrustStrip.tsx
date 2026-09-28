import { Car, Moon, Plane, Stethoscope, UserRound } from "lucide-react";

const items = [
  { icon: Car, label: "Black Cadillac SUV" },
  { icon: Plane, label: "DFW and Love Field, any hour" },
  { icon: Moon, label: "WinStar and local trips" },
  { icon: Stethoscope, label: "Medical appointments" },
  { icon: UserRound, label: "You know your driver" },
];

export function TrustStrip() {
  return (
    <div className="border-b border-white/5 bg-ink-900/60">
      <ul className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm text-ink-300" aria-label="What PJ's offers">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="inline-flex items-center gap-2">
            <Icon className="size-4 text-gold-400" aria-hidden="true" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
