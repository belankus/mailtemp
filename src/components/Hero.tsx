import { Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="container mx-auto px-5 py-20 md:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
          <Mail className="h-3.5 w-3.5" /> Disposable inbox, auto‑expires in 1
          hour
        </span>
        <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl">
          Keep your primary inbox clean. Use a temp email.
        </h1>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          Generate a temporary address, receive emails instantly, and let it
          vanish after an hour of inactivity.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#get-started"
            className="w-full rounded-xl bg-slate-900 px-6 py-3 text-center text-white transition-colors duration-200 hover:bg-slate-700 sm:w-auto"
          >
            Create a temp address
          </a>
          <a
            href="#how"
            className="w-full rounded-xl border border-slate-200 px-6 py-3 text-center transition-colors duration-200 hover:bg-slate-50 sm:w-auto"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
