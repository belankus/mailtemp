"use client";

import { useState } from "react";
import { Mail, Key } from "lucide-react";
import useToast from "@/components/Toast";
import InboxViewer from "./InboxViewer";

interface Props {
  onSelect?: (address: string, token: string) => void;
}

export default function UseExistingEmail({ onSelect }: Props) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showInbox, setShowInbox] = useState(false);

  const { show, ToastUI } = useToast();

  async function handleUseExisting() {
    if (!email || !token) {
      show("Email and token are required");
      return;
    }

    setLoading(true);
    setError(null);
    setMessages([]);

    try {
      const res = await fetch("/api/use-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch messages");
        show(data.error || "Failed to fetch messages");
        setShowInbox(false);
        return;
      }
      setShowInbox(true);
      setMessages(data.messages);
      show("Email loaded successfully!");

      if (onSelect) onSelect(email, token);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      show(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-10 px-5 md:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Use Existing Email
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Enter your temporary email address and access token
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your temp email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-3 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Key className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter access token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-3 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={handleUseExisting}
              disabled={loading || !email || !token}
              className="w-full rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Loading...
                </span>
              ) : (
                "Access Inbox"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm leading-relaxed text-red-700">{error}</p>
            </div>
          )}
        </div>

        {showInbox && (
          <div className="mt-6">
            <InboxViewer address={email} token={token} />
          </div>
        )}
      </div>

      {ToastUI}
    </div>
  );
}
