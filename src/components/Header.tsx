// components/Header.tsx
"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 flex border-b border-slate-200/60 bg-white/95 backdrop-blur-sm">
      <div className="relative container mx-5 flex h-14 items-center justify-center md:mx-auto md:justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="absolute left-0 block rounded-sm p-1.5 transition-colors duration-200 hover:bg-slate-100 active:bg-slate-200 md:hidden"
          aria-label="Toggle menu"
        >
          <div className="relative h-6 w-6">
            {/* Menu Icon */}
            <div
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                showMenu
                  ? "scale-75 rotate-180 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
            >
              <Menu />
            </div>
            {/* X Icon */}
            <div
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                showMenu
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-75 -rotate-180 opacity-0"
              }`}
            >
              <X />
            </div>
          </div>
        </button>

        {/* Logo */}
        <Link href="/" className="font-semibold" onClick={closeMenu}>
          <Image src="/logo.png" alt="MailTemp" width={150} height={30} />
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden items-center justify-center gap-6 text-sm md:flex">
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
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-slate-700"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Navigation - Always rendered but conditionally visible */}
        <div
          className={`absolute top-14 right-0 left-0 z-50 transition-all duration-300 ease-in-out md:hidden ${
            showMenu
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-2 rounded-b-lg border border-slate-200/60 bg-white p-4 shadow-lg">
            <Link
              href="/"
              className="rounded-md px-3 py-2 transition-colors duration-200 hover:bg-slate-50"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/terms"
              className="rounded-md px-3 py-2 transition-colors duration-200 hover:bg-slate-50"
              onClick={closeMenu}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-md px-3 py-2 transition-colors duration-200 hover:bg-slate-50"
              onClick={closeMenu}
            >
              Privacy
            </Link>
            <Link
              href="/#get-started"
              className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-center text-white transition-colors duration-200 hover:bg-slate-700"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          showMenu ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMenu}
      />
    </header>
  );
}
