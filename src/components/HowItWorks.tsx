export default function HowItWorks() {
  const steps = [
    {
      n: 1,
      t: "Generate",
      d: "Click 'Create a temp address'. We'll give you a unique inbox.",
    },
    {
      n: 2,
      t: "Receive",
      d: "Use it anywhere. Emails arrive here within seconds.",
    },
    {
      n: 3,
      t: "Expire",
      d: "If you don't access it for an hour, it disappears automatically.",
    },
  ];

  return (
    <section id="how" className="container mx-auto px-5 py-16 md:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-slate-600 md:text-lg">
          Get started in three simple steps
        </p>
      </div>

      <div className="relative mt-12">
        <div className="grid gap-8 sm:gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative z-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {s.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                {s.d}
              </p>
            </div>
          ))}
        </div>

        {/* Connection lines between boxes - positioned absolutely */}
        <div className="absolute top-1/2 left-1/3 hidden h-0.5 w-1/3 -translate-x-1/2 -translate-y-1/2 transform bg-slate-200 md:block" />
        <div className="absolute top-1/2 left-2/3 hidden h-0.5 w-1/3 -translate-x-1/2 -translate-y-1/2 transform bg-slate-200 md:block" />
      </div>
    </section>
  );
}
