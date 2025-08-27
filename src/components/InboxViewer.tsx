"use client";

import { useEffect, useMemo, useState } from "react";
import useToast from "@/components/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";

type MsgListItem = {
  id: string;
  fromAddr: string;
  subject: string | null;
  receivedAt: string;
  snippet?: string | null;
  has_attachments?: boolean;
};

type MsgDetail = {
  id: string;
  fromAddr: string;
  subject: string | null;
  receivedAt: string;
  text?: string | null;
  htmlSanitized?: string | null;
  attachments?: { name: string; size: number; download_url?: string }[];
};

interface Props {
  address: string;
  token: string;
}

export default function InboxViewer({ address, token }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MsgListItem[]>([]);
  const [selected, setSelected] = useState<MsgDetail | null>(null);
  const { show, ToastUI } = useToast();

  const deepLink = useMemo(() => {
    const url = new URL(window.location.href);
    url.hash = ""; // avoid double anchors
    url.searchParams.set("address", address);
    url.searchParams.set("token", token);
    return url.toString();
  }, [address, token]);

  // Poll inbox list
  useEffect(() => {
    let abort = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/inbox/${encodeURIComponent(address)}?token=${encodeURIComponent(
            token,
          )}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`Inbox request failed: ${res.status}`);
        const data = (await res.json()) as MsgListItem[];
        if (!abort) {
          setMessages(data);
          setError(null);
        }
      } catch (e: any) {
        if (!abort) setError(e?.message || "Failed to load inbox");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 8000);
    return () => {
      abort = true;
      clearInterval(id);
    };
  }, [address, token]);

  // Load message detail
  async function openMessage(id: string) {
    setSelected(null);
    try {
      const res = await fetch(
        `/api/message/${encodeURIComponent(id)}?token=${encodeURIComponent(
          token,
        )}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Message request failed: ${res.status}`);
      const data = (await res.json()) as MsgDetail;
      setSelected(data);
    } catch (e: any) {
      setSelected(null);
      show(e?.message || "Failed to open message");
    }
  }

  return (
    <div className="mt-10 grid min-h-[300px] md:grid-cols-[200px_minmax(0,1fr)]">
      {/* Sidebar: Inbox list */}
      <div className="overflow-hidden rounded-l-2xl border bg-white">
        <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3">
          <div className="flex gap-2">
            <Inbox size={20} />
            <span className="text-base text-slate-500 uppercase">Inbox</span>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">
            No messages yet. Keep this page open.
          </div>
        )}

        <ul className="max-h-[70vh] overflow-auto">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => openMessage(m.id)}
                  className="w-full cursor-pointer border-b border-gray-400 p-3 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="truncate text-sm font-medium"
                      title={m.fromAddr}
                    >
                      {m.fromAddr}
                    </div>
                    <div className="shrink-0 text-xs text-slate-500">
                      {new Date(m.receivedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    className="truncate text-sm text-slate-600"
                    title={m.subject || "(no subject)"}
                  >
                    {m.subject || <em>(no subject)</em>}
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* Content: Message preview */}
      <div className="rounded-r-2xl border border-l-0 bg-white p-4">
        {!selected && (
          <div className="grid h-full place-items-center p-10 text-center text-slate-500">
            <div>
              <p className="text-sm">Select a message to preview</p>
              <p className="mt-1 text-xs">Messages auto‑refresh every ~8s</p>
            </div>
          </div>
        )}

        {selected && (
          <article className="prose prose-slate max-w-none">
            <div className="mb-4 border-b pb-3">
              <div className="text-xs text-slate-500 uppercase">From</div>
              <div className="font-medium break-all">{selected.fromAddr}</div>
              <div className="mt-2 text-xs text-slate-500">
                {new Date(selected.receivedAt).toLocaleString()}
              </div>
              <h2 className="mt-3 text-lg font-semibold">
                {selected.subject || "(no subject)"}
              </h2>
            </div>

            {/* Prefer safe text; allow sanitized HTML if provided */}
            {selected.text && (
              <pre className="rounded-lg bg-slate-50 p-4 text-sm whitespace-pre-wrap">
                {selected.text}
              </pre>
            )}
            {!selected.text && selected.htmlSanitized && (
              <div
                className="rounded-lg border p-4"
                dangerouslySetInnerHTML={{ __html: selected.htmlSanitized }}
              />
            )}

            {selected.attachments && selected.attachments.length > 0 && (
              <div className="mt-6">
                <div className="text-xs text-slate-500 uppercase">
                  Attachments
                </div>
                <ul className="mt-2 space-y-2">
                  {selected.attachments.map((a) => (
                    <li
                      key={a.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate" title={a.name}>
                        {a.name}
                      </span>
                      {a.download_url ? (
                        <a
                          href={a.download_url}
                          className="text-sm text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">
                          (not available)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        )}
      </div>

      {ToastUI}
    </div>
  );
}
