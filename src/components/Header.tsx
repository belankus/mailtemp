// components/Header.tsx
"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  return (
    <header className="flex border-b border-slate-200/60">
      <div className="relative container mx-5 flex h-14 items-center justify-center md:mx-auto md:justify-between">
        <button
          onClick={(e) => {
            e.preventDefault;
            setShowMenu(true);
          }}
          className="absolute left-0 block rounded-sm p-1.5 active:border md:hidden"
        >
          <Menu />
        </button>

        {/* Logo */}
        <Link href="/" className="font-semibold">
          MailTemp
        </Link>
        <nav className={`flex items-center justify-center gap-6 text-sm`}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link
            href="/#get-started"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
