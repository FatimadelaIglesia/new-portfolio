import type { Metadata } from "next";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Fatima de la Iglesia | Junior Web Developer",
  description:
    "Portfolio of Fatima de la Iglesia, a Junior Web Developer specializing in React, responsive design, and accessible front-end experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${lato.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-text">
        {children}
      </body>
    </html>
  );
}
