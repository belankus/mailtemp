"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Is this really anonymous?",
    a: "We don't require accounts. Inboxes are short‑lived and auto‑deleted. Avoid using MailTemp for anything sensitive or illegal.",
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-5 py-16 md:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-slate-600 md:text-lg">
          Everything you need to know about MailTemp
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-4">
        {faqs.map((f, index) => (
          <div
            key={f.q}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between rounded-2xl p-6 text-left transition-colors duration-200 hover:bg-slate-50"
              aria-expanded={openIndex === index}
            >
              <h3 className="pr-4 text-base font-semibold text-slate-900 md:text-lg">
                {f.q}
              </h3>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pt-0 pb-6">
                <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
