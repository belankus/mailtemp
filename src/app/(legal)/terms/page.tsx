import Footer from "@/components/Footer";
import Header from "@/components/Header";

// app/(legal)/terms/page.tsx
export const metadata = {
  title: "Terms of Service – MailTemp",
  description:
    "Terms of Service for MailTemp. By accessing or using MailTemp, you agree to be bound by these Terms of Service.",
  metadataBase: new URL("https://mailtemp.my.id/terms"),
  openGraph: {
    title: "MailTemp – Use Existing Email | Disposable inbox for 1 hour",
    description:
      "Terms of Service for MailTemp. By accessing or using MailTemp, you agree to be bound by these Terms of Service.",
    url: "https://mailtemp.my.id/terms",
    siteName: "MailTemp",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MailTemp" }],
    locale: "en_US",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main>
      <Header />
      <div className="container mx-auto min-h-screen px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-gray-600 italic">
          <em>Last updated: 24 August 2025</em>
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              By accessing or using MailTemp (the “Service”), you agree to be
              bound by these Terms of Service (the “Terms”). If you do not
              agree, do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              2. Service Description
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              MailTemp provides short‑lived, disposable email inboxes intended
              for lawful, privacy‑preserving use such as software testing or
              temporary sign‑ups. Inboxes auto‑expire after one (1) hour of
              inactivity. Messages and any related data are purged as part of
              scheduled cleanup.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              3. Permitted & Prohibited Use
            </h2>
            <ul className="list-disc pl-6 text-lg leading-relaxed text-gray-700">
              <li>
                Permitted: testing, anonymous sign‑ups for legitimate purposes,
                protecting your primary inbox.
              </li>
              <li>
                Prohibited: spam, harassment, fraud, phishing, distribution of
                malware or illegal content, infringement of intellectual
                property, or any activity that violates applicable law or these
                Terms.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              4. No Accounts; Access Tokens
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              The Service may issue non‑personal access tokens to view a
              temporary inbox. Keep your token secure. Anyone holding the token
              may access the associated inbox until it expires.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              5. Content Handling
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              For safety, remote images, scripts, and other active content may
              be blocked by default. Attachments may be restricted or
              unavailable. The Service may remove or refuse content at its
              discretion to mitigate abuse.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              6. Data Retention
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Inboxes are short‑lived. After one hour of inactivity, we schedule
              deletion of the inbox and related data. Operational logs may be
              retained briefly for troubleshooting and security, then deleted.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              7. Intellectual Property
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              You represent that your use of the Service and any content you
              receive or transmit does not infringe third‑party rights. Report
              infringement or abuse to the contact provided below.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              8. Disclaimers
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING FITNESS FOR
              A PARTICULAR PURPOSE, NON‑INFRINGEMENT, OR AVAILABILITY. We do not
              guarantee delivery of any email or continuous operation of the
              Service.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              9. Limitation of Liability
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE
              LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR
              REPUTATION, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              10. Termination
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We may suspend or terminate access to the Service at any time,
              with or without notice, for any reason including abuse,
              operational needs, or legal requirements.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              11. Changes to Terms
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              We may revise these Terms from time to time. The “Last updated”
              date indicates the latest changes. Continued use means you accept
              the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              12. Contact
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Questions or abuse reports:{" "}
              <a
                href="mailto:abuse@mailtemp.my.id"
                className="text-blue-600 hover:underline"
              >
                abuse@mailtemp.my.id
              </a>
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
