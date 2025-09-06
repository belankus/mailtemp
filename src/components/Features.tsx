import { Shield, Clock3, EyeOff, Zap } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Safer sign‑ups",
    desc: "Protect your identity when testing or signing up for trials.",
  },
  {
    icon: Clock3,
    title: "1‑hour inactivity",
    desc: "Your inbox auto‑expires after an hour without access.",
  },
  {
    icon: EyeOff,
    title: "Minimal data",
    desc: "No accounts. No long‑term logs. Short‑lived inboxes only.",
  },
  {
    icon: Zap,
    title: "Fast & free",
    desc: "Built on serverless infra with generous free tiers.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-slate-200/60 bg-slate-50/60">
      <div className="container mx-auto px-5 py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-slate-700" />
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
