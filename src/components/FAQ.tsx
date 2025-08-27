const faqs = [
  {
    q: "Is this really anonymous?",
    a: "We don’t require accounts. Inboxes are short‑lived and auto‑deleted. Avoid using MailTemp for anything sensitive or illegal.",
  },
  {
    q: "Can I forward emails?",
    a: "No. Read emails on this site only. Remote images and scripts are blocked by default for safety.",
  },
  {
    q: "How long are messages stored?",
    a: "The inbox expires after 1 hour of inactivity. We purge the inbox and related data as part of scheduled cleanup.",
  },
];

export default function FAQ() {
  return (
    <section className="container mx-auto py-16">
      <h2 className="text-center text-2xl font-semibold">FAQ</h2>
      <div className="mx-auto mt-8 max-w-3xl space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border p-6">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
