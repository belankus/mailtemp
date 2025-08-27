import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MailTemp – Use Existing Email | Disposable inbox for 1 hour",
  description:
    "Use existing email addresses that auto-expire after 1 hour of inactivity. Protect your privacy and keep your primary inbox clean.",
  metadataBase: new URL("https://mailtemp.my.id/use-email"),
  openGraph: {
    title: "MailTemp – Use Existing Email | Disposable inbox for 1 hour",
    description:
      "Use existing email addresses that auto-expire after 1 hour of inactivity.",
    url: "https://mailtemp.my.id/use-email",
    siteName: "MailTemp",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MailTemp" }],
    locale: "en_US",
    type: "website",
  },
};

export default function UseMailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
