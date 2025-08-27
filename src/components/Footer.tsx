import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} MailTemp. All rights reserved.
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
