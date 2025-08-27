"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  function show(msg: string, ms = 2000) {
    setMessage(msg);
    setTimeout(() => setMessage(null), ms);
  }

  const ToastUI = (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 rounded-lg bg-slate-900 px-4 py-2 text-white shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { show, ToastUI };
}
