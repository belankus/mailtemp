import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailTemp – Disposable inbox for 1 hour",
  description:
    "Free temporary email addresses that auto‑expire after 1 hour of inactivity. Protect your privacy and keep your primary inbox clean.",
  metadataBase: new URL("https://mailtemp.my.id"),
  openGraph: {
    title: "MailTemp – Disposable inbox for 1 hour",
    description:
      "Free temporary email addresses that auto‑expire after 1 hour of inactivity.",
    url: "https://mailtemp.my.id",
    siteName: "MailTemp",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MailTemp" }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
