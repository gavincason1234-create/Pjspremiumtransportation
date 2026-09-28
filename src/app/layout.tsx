import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { StickyCta } from "@/components/site/StickyCta";
import { BUSINESS, siteUrl } from "@/lib/site";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });

const description =
  "Reserved private rides from Myra and North Texas to DFW Airport, Love Field, medical appointments, WinStar and the Metroplex. Smooth, responsible, respectful drivers. Call or text (940) 277-9099.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${BUSINESS.name} | Private rides in Myra & North Texas`,
    template: `%s | ${BUSINESS.name}`,
  },
  description,
  applicationName: BUSINESS.name,
  keywords: ["airport transportation Myra TX", "DFW airport car service Gainesville", "WinStar casino ride", "medical appointment transportation Cooke County", "private driver North Texas"],
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: `${BUSINESS.name} — ${BUSINESS.tagline}` }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description,
    images: ["/brand/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col pb-20 lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
