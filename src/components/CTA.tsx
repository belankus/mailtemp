import GenerateAddress from "@/components/GenerateAddress";
import Link from "next/link";

export default function CTA() {
  return (
    <section
      id="get-started"
      className="border-t border-slate-200/60 bg-slate-50/60"
    >
      <div className="container mx-auto px-5 py-16 text-center md:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Ready to try MailTemp?
          </h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            Generate a temporary inbox and start receiving emails instantly.
          </p>

          <div className="mx-auto mt-8 max-w-xl space-y-4">
            <GenerateAddress />
            <div className="text-center">
              <span className="text-sm text-slate-500">or</span>
            </div>
            <Link
              href="/use-email"
              className="block w-full rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
            >
              Use an existing email
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
              <span>Auto-expires in 1 hour</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
