"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  session: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "首頁" },
    { href: "/bikes", label: "探索車款" },
  ];

  if (session) {
    navLinks.push({ href: "/dashboard", label: "會員中心" });
  }

  if (session?.user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "管理後台" });
  }

  return (
    <nav className="glass-strong fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] to-[#3b82f6]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
            </svg>
          </div>
          <span className="gradient-text text-xl font-bold tracking-tight">
            VeloCity
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-[rgba(34,197,94,0.15)] text-[#4ade80]"
                  : "text-[#94a3b8] hover:bg-[rgba(148,163,184,0.1)] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#94a3b8]">
                {session.user.name ?? session.user.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="rounded-lg border border-[rgba(148,163,184,0.2)] px-4 py-2 text-sm font-medium text-[#94a3b8] transition-all hover:border-[rgba(239,68,68,0.3)] hover:text-[#f87171]"
              >
                登出
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin" className="btn-secondary text-sm">
                登入
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm">
                註冊
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[rgba(148,163,184,0.1)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-[rgba(34,197,94,0.15)] text-[#4ade80]"
                    : "text-[#94a3b8] hover:bg-[rgba(148,163,184,0.1)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-[rgba(148,163,184,0.1)]" />
            {session ? (
              <Link
                href="/api/auth/signout"
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#f87171] transition-all hover:bg-[rgba(239,68,68,0.1)]"
              >
                登出
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="rounded-lg px-4 py-3 text-center text-sm font-medium text-[#60a5fa]"
                >
                  登入
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary rounded-lg text-center text-sm"
                >
                  註冊
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.1)] bg-[rgba(15,23,42,0.8)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] to-[#3b82f6]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
              <span className="gradient-text text-lg font-bold">VeloCity</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#94a3b8]">
              VeloCity
              是您的智慧腳踏車租借平台。我們提供頂級公路車、登山車與電輔車，讓您隨時預約、輕鬆出發，享受都市與自然的每一段旅程。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">快速連結</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/bikes"
                className="text-sm text-[#94a3b8] transition-colors hover:text-[#4ade80]"
              >
                探索車款
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm text-[#94a3b8] transition-colors hover:text-[#4ade80]"
              >
                會員登入
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm text-[#94a3b8] transition-colors hover:text-[#4ade80]"
              >
                註冊帳號
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">聯繫我們</h4>
            <div className="flex flex-col gap-2 text-sm text-[#94a3b8]">
              <span>📍 台北市信義區信義路五段7號</span>
              <span>📞 (02) 1234-5678</span>
              <span>✉️ hello@velocity.tw</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgba(148,163,184,0.1)] pt-6 text-center text-xs text-[#64748b]">
          © 2026 VeloCity. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
