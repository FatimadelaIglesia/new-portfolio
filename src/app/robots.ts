import type { MetadataRoute } from "next";

const base = (
  process.env.SITE_URL || "https://new-portfolio-sepia-two.vercel.app"
).replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/settings", "/login", "/api/"],
    },
    sitemap: base + "/sitemap.xml",
  };
}
