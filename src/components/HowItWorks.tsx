export default function HowItWorks() {
  const steps = [
    {
      n: 1,
      t: "Generate",
      d: "Click ‘Create a temp address’. We’ll give you a unique inbox.",
    },
    {
      n: 2,
      t: "Receive",
      d: "Use it anywhere. Emails arrive here within seconds.",
    },
    {
      n: 3,
      t: "Expire",
      d: "If you don’t access it for an hour, it disappears automatically.",
    },
  ];
  return (
    <section id="how" className="container mx-auto py-16">
      <h2 className="text-center text-2xl font-semibold">How it works</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-sm font-bold">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
