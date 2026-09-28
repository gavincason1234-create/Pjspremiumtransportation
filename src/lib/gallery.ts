import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  file: string;
}

/**
 * Photos are whatever the owner drops into /public/gallery — no code change needed.
 * Alt text/captions derive from the file name ("07-new-suv.jpg" → "New suv") unless listed in OVERRIDES.
 * Sorted by file name, so a numeric prefix controls the order.
 */
const OVERRIDES: Record<string, { alt: string; caption: string }> = {
  "01-cadillac-winstar-night.jpg": {
    alt: "Black Cadillac SUV parked outside WinStar World Casino and Resort at night",
    caption: "Night run to WinStar, with the Cadillac waiting outside the resort",
  },
  "02-back-seat-blanket-pillow.jpg": {
    alt: "Light leather back seat of a Cadillac SUV with a folded blanket, pillow and gift bag",
    caption: "The back seat, ready: a blanket and pillow for early flights and late returns",
  },
  "03-rider-thank-you-gift-bag.jpg": {
    alt: "Branded PJ's thank-you gift bag with tissues, mints and a snack",
    caption: "Every rider leaves with a thank-you bag: tissues, mints, a snack and a note from Patsy",
  },
  "04-riders-at-the-airport.jpg": {
    alt: "Smiling riders standing beside the Cadillac SUV at an airport curb",
    caption: "Riders arriving at the airport, on time and unhurried",
  },
  "05-patsy-behind-the-wheel.jpg": {
    alt: "Patsy, owner of PJ's Premium Transportation, seated in the driver's seat under the sunroof",
    caption: "Patsy, behind the wheel",
  },
  "06-patsy-and-her-dog.jpg": {
    alt: "Patsy smiling with her dog",
    caption: "Patsy and her dog, off the clock",
  },
};

const EXT = /\.(jpe?g|png|webp|avif)$/i;

export function getGalleryImages(): GalleryImage[] {
  const dir = join(process.cwd(), "public", "gallery");
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => EXT.test(f) && statSync(join(dir, f)).isFile());
  } catch {
    return [];
  }
  return files.sort().map((file) => ({
    file,
    src: `/gallery/${file}`,
    alt: OVERRIDES[file]?.alt ?? humanize(file),
    caption: OVERRIDES[file]?.caption ?? humanize(file),
  }));
}

function humanize(file: string): string {
  const base = file.replace(EXT, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return base ? base[0].toUpperCase() + base.slice(1) : "Photo from PJ's Premium Transportation";
}
