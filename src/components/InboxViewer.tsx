"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Inbox,
  Mail,
  Clock,
  Paperclip,
  Shield,
  Eye,
  AlertTriangle,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import useToast from "@/components/Toast";

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
  textBody?: string | null;
  htmlSanitized?: string | null;
  r2KeysAttach?: string[];
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
  const [showRemoteContent, setShowRemoteContent] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showMessageList, setShowMessageList] = useState(true);
  const { show, ToastUI } = useToast();

  const deepLink = useMemo(() => {
    const url = new URL(window.location.href);
    url.hash = "";
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
          `/api/inbox/${encodeURIComponent(address)}?token=${encodeURIComponent(token)}`,
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
    setShowRemoteContent(false);
    setShowAttachments(false);
    try {
      const res = await fetch(
        `/api/message/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Inbox</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                {messages.length}
                <span className="hidden md:inline-block"> messages</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {selected && (
                <button
                  onClick={() => setShowMessageList(!showMessageList)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200"
                  title={
                    showMessageList ? "Hide message list" : "Show message list"
                  }
                >
                  {showMessageList ? (
                    <>
                      <PanelLeftClose className="h-4 w-4" />
                      <span className="sr-only">Hide list</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftOpen className="h-4 w-4" />
                      <span className="sr-only">Show list</span>
                    </>
                  )}
                </button>
              )}
              <div className="text-xs text-slate-500">
                Auto-refresh every 8 seconds
              </div>
            </div>
          </div>
        </div>

        <div className={`flex min-h-[500px] transition-all duration-300`}>
          {/* Sidebar: Message List */}
          <div
            className={`overflow-hidden border-r border-slate-200 bg-slate-50/30 transition-[width] ease-in-out ${
              showMessageList ? "w-full md:w-[300px]" : "w-0"
            }`}
          >
            {/* Loading State */}
            {loading && (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-slate-200"
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-4">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && messages.length === 0 && (
              <div className="p-8 text-center">
                <Mail className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No messages yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Keep this page open to see new emails
                </p>
              </div>
            )}

            {/* Message List */}
            <div className="max-h-[500px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => openMessage(m.id)}
                      className={`w-full border-b border-slate-100 p-4 text-left transition-colors duration-200 hover:bg-white ${
                        selected?.id === m.id ? "border-slate-200 bg-white" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div
                          className="truncate text-sm font-medium text-slate-900"
                          title={m.fromAddr}
                        >
                          {m.fromAddr}
                        </div>
                        <div className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(m.receivedAt)}
                        </div>
                      </div>
                      <div
                        className="mb-1 truncate text-sm text-slate-700"
                        title={m.subject || "(no subject)"}
                      >
                        {m.subject || (
                          <em className="text-slate-500">(no subject)</em>
                        )}
                      </div>
                      {m.snippet && (
                        <div className="truncate text-xs text-slate-500">
                          {m.snippet}
                        </div>
                      )}
                      {m.has_attachments && (
                        <div className="mt-2 flex items-center gap-1">
                          <Paperclip className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            Has attachments
                          </span>
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Content: Message Preview */}
          <div
            className={`overflow-x-auto ${showMessageList ? "w-0 md:w-full md:p-6" : "w-full p-6"}`}
          >
            {!selected && (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <Mail className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  <p className="font-medium text-slate-600">
                    Select a message to preview
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Messages automatically refresh every 8 seconds
                  </p>
                </div>
              </div>
            )}

            {selected && (
              <div className="max-w-none">
                {/* Message Header */}
                <div className="mb-6 border-b border-slate-200 pb-4">
                  <h2 className="mb-3 text-xl font-semibold text-slate-900">
                    {selected.subject || "(no subject)"}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                        From
                      </span>
                      <span className="text-sm font-medium break-all text-slate-900">
                        {selected.fromAddr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {new Date(selected.receivedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-6">
                  {/* Text Body - Always show if available */}
                  {selected.textBody && (
                    <div>
                      <div className="rounded-xl border bg-slate-50 p-4">
                        <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                          {selected.textBody}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* HTML Content Warning */}
                  {!selected.textBody &&
                    selected.htmlSanitized &&
                    !showRemoteContent && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="mt-0.5 h-5 w-5 text-amber-600" />
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-800">
                              Remote content blocked
                            </h4>
                            <p className="mt-1 text-sm text-amber-700">
                              This message contains HTML content. For security,
                              remote images and scripts are blocked.
                            </p>
                            <button
                              onClick={() => setShowRemoteContent(true)}
                              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition-colors duration-200 hover:bg-amber-200"
                            >
                              <Eye className="h-4 w-4" />
                              Show content anyway
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* HTML Content - Show when approved */}
                  {!selected.textBody &&
                    selected.htmlSanitized &&
                    showRemoteContent && (
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-xs text-amber-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            Showing remote content - be cautious with links and
                            downloads
                          </span>
                        </div>
                        <div
                          className="prose prose-sm max-w-none rounded-xl border border-slate-200 p-4"
                          dangerouslySetInnerHTML={{
                            __html: selected.htmlSanitized,
                          }}
                        />
                      </div>
                    )}

                  {/* No Content */}
                  {!selected.textBody && !selected.htmlSanitized && (
                    <div className="py-8 text-center text-slate-500">
                      <Mail className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                      <p>This message has no readable content</p>
                    </div>
                  )}

                  {/* Attachments Section */}
                  {selected.r2KeysAttach &&
                    selected.r2KeysAttach.length > 0 && (
                      <div>
                        {!showAttachments && (
                          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                              <Paperclip className="mt-0.5 h-5 w-5 text-blue-600" />
                              <div className="flex-1">
                                <h4 className="font-medium text-blue-800">
                                  {selected.r2KeysAttach.length} attachment
                                  {selected.r2KeysAttach.length > 1 ? "s" : ""}
                                </h4>
                                <p className="mt-1 text-sm text-blue-700">
                                  Only download attachments from trusted
                                  sources.
                                </p>
                                <button
                                  onClick={() => setShowAttachments(true)}
                                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 transition-colors duration-200 hover:bg-blue-200"
                                >
                                  <Eye className="h-4 w-4" />
                                  Show attachments
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {showAttachments && (
                          <div>
                            <div className="mb-3 flex items-center gap-2 text-xs text-blue-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>
                                Be careful when downloading attachments from
                                unknown senders
                              </span>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-4">
                              <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-900">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                              </h4>
                              <div className="space-y-2">
                                {selected.r2KeysAttach.map(
                                  (attachmentKey, index) => {
                                    // Extract filename from R2 key (assuming format like "attachments/message-id/filename")
                                    const filename =
                                      attachmentKey.split("/").pop() ||
                                      `attachment-${index + 1}`;

                                    return (
                                      <div
                                        key={attachmentKey}
                                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                                      >
                                        <div className="flex flex-1 items-center gap-3">
                                          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100">
                                            <Paperclip className="h-4 w-4 text-slate-600" />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p
                                              className="truncate text-sm font-medium text-slate-900"
                                              title={filename}
                                            >
                                              {filename}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                              R2 Key: {attachmentKey}
                                            </p>
                                          </div>
                                        </div>
                                        <a
                                          href={`/api/download-attachment?attachmentKey=${encodeURIComponent(attachmentKey)}&token=${encodeURIComponent(token)}&messageId=${encodeURIComponent(selected.id)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-slate-700"
                                        >
                                          Download
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {ToastUI}
    </div>
  );
}
