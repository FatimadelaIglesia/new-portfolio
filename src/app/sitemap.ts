import type { MetadataRoute } from "next";

const base = (
  process.env.SITE_URL || "https://new-portfolio-sepia-two.vercel.app"
).replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/skills", "/projects", "/contact", "/guestbook", "/privacy"];
  return paths.map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));
}
