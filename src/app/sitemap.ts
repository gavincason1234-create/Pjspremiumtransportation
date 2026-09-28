import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reviews", priority: 0.8, changeFrequency: "weekly" },
    { path: "/drive", priority: 0.6, changeFrequency: "monthly" },
    { path: "/track", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({ url: `${base}${p.path}`, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority }));
}
