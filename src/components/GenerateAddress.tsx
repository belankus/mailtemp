"use client";

import { useState } from "react";
import useToast from "@/components/Toast";
import InboxViewer from "./InboxViewer";

export default function GenerateAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    address: string;
    token: string;
    expiresAt: string;
  } | null>(null);

  const { show, ToastUI } = useToast();

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/addresses", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setError(null);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      show("Copied to clipboard!");
    } catch {
      show("Failed to copy");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full cursor-pointer rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Generating…" : "Create a temp address"}
      </button>

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <>
          <div className="mt-6 space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
            <div>
              <div className="text-xs text-slate-500 uppercase">
                Temp address
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <code className="rounded bg-slate-50 px-2 py-1 text-sm">
                  {result.address}
                </code>
                <button
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
                  onClick={() => copy(result.address)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">
                Access token
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <code className="rounded bg-slate-50 px-2 py-1 text-sm">
                  {result.token}
                </code>
                <button
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
                  onClick={() => copy(result.token)}
                >
                  Copy
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Expires at: {new Date(result.expiresAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-8">
            <InboxViewer address={result.address} token={result.token} />
          </div>
        </>
      )}

      {ToastUI}
    </div>
  );
}
