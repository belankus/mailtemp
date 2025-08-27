import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Privacy Policy – MailTemp",
  description:
    "Our Privacy Policy explains how MailTemp (“we”/“us”) handles information when you use our temporary inbox Service. We design the Service to minimize data and retain information only briefly.",
  metadataBase: new URL("https://mailtemp.my.id/privacy"),
  openGraph: {
    title: "MailTemp – Use Existing Email | Disposable inbox for 1 hour",
    description:
      "Our Privacy Policy explains how MailTemp (“we”/“us”) handles information when you use our temporary inbox Service. We design the Service to minimize data and retain information only briefly.",
    url: "https://mailtemp.my.id/privacy",
    siteName: "MailTemp",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MailTemp" }],
    locale: "en_US",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <Header />
      <div className="container mx-auto min-h-screen px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-gray-600 italic">
          <em>Last updated: 24 August 2025</em>
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              1. Overview
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              This Privacy Policy explains how MailTemp (“we”/“us”) handles
              information when you use our temporary inbox Service. We design
              the Service to minimize data and retain information only briefly.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              2. Information We Process
            </h2>
            <ul className="list-disc pl-6 text-lg leading-relaxed text-gray-700">
              <li>
                <strong>Inbox data:</strong> temporary email address, messages
                received, basic headers, and optional attachments. We may store
                sanitized text/HTML for safe rendering. Inbox data auto‑expires
                after one (1) hour of inactivity.
              </li>
              <li>
                <strong>Operational data:</strong> transient logs (e.g.,
                timestamps, IPs) for security and troubleshooting, retained
                briefly and then deleted.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              3. Purpose & Legal Basis
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We process data to provide the Service (create a temporary inbox,
              receive email), protect against abuse, ensure security, and
              maintain functionality. Our legal basis is performance of a
              service you request and our legitimate interest in keeping the
              Service secure.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              4. Retention
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Inbox data is scheduled for deletion after one hour of inactivity.
              Operational logs are kept only as long as necessary for security
              and diagnostics.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              5. Sharing
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We do not sell data. We may share limited information with service
              providers (e.g., hosting/storage) under confidentiality
              agreements, and disclose information when required by law or to
              respond to abuse reports.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              6. Security
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We use reasonable technical and organizational measures
              appropriate for a short‑lived service. No system can be 100%
              secure. Do not use the Service for sensitive data.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              7. Your Choices
            </h2>
            <ul className="list-disc pl-6 text-lg leading-relaxed text-gray-700">
              <li>
                Use the Service without creating an account; keep your access
                token confidential.
              </li>
              <li>
                Do not load remote images or click links you do not trust.
              </li>
              <li>
                Stop accessing an inbox and it will expire and be deleted per
                schedule.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              8. International Transfers
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Depending on infrastructure location, data may be processed
              outside your country. We use reputable providers and standard
              protections to the extent applicable.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              9. Changes
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We may update this Policy from time to time. The “Last updated”
              date indicates the latest changes.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              10. Contact
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Privacy questions or requests:{" "}
              <a
                href="mailto:privacy@mailtemp.my.id"
                className="text-blue-600 hover:underline"
              >
                privacy@mailtemp.my.id
              </a>
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
