import type { Metadata } from "next";
import Script from "next/script";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";
import ToastProvider from "@/components/ToastProvider";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = (
  process.env.SITE_URL || "https://new-portfolio-sepia-two.vercel.app"
).replace(/\/+$/, "");

const description =
  "Portfolio of Fatima de la Iglesia, a Junior Web Developer specializing in React, responsive design, and accessible front-end experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fatima de la Iglesia | Junior Web Developer",
    template: "%s | Fatima de la Iglesia",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Fatima de la Iglesia",
    locale: "en_GB",
    url: "/",
    title: "Fatima de la Iglesia | Junior Web Developer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fatima de la Iglesia | Junior Web Developer",
    description,
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){}})();`;

const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiSrc =
  process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${josefinSans.variable} ${lato.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-text">
        <ToastProvider>
          <ScrollReveal />
          {children}
        </ToastProvider>
        {umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            data-do-not-track="true"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
