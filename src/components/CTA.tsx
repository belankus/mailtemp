import GenerateAddress from "@/components/GenerateAddress";
import Link from "next/link";

export default function CTA() {
  return (
    <section
      id="get-started"
      className="border-t border-slate-200/60 bg-slate-50/60"
    >
      <div className="container mx-auto px-4 py-16 text-center md:px-6">
        <h2 className="text-2xl font-semibold">Ready to try MailTemp?</h2>
        <p className="mt-2 text-slate-600">
          Generate a temporary inbox and start receiving emails instantly.
        </p>

        <div className="mx-auto mt-6 max-w-xl">
          <GenerateAddress />
          <Link
            href="/use-email"
            className="mt-4 block rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Use an existing email
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          No account required. Inbox auto‑expires after 1 hour of inactivity.
        </p>
      </div>
    </section>
  );
}
