"use client";

import { useState } from "react";
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
    <div className="container mx-auto my-10 max-w-2xl space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">
        Use Existing Email
      </h3>

      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Enter your temp email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Enter access token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
        <button
          onClick={handleUseExisting}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Use Existing Email"}
        </button>
      </div>

      {error && (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {showInbox && (
        <div className="mt-4">
          <InboxViewer address={email} token={token} />
        </div>
      )}

      {ToastUI}
    </div>
  );
}
