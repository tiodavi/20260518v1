"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "儀表板", icon: "📊" },
  { href: "/admin/bikes", label: "車輛管理", icon: "🚲" },
  { href: "/admin/orders", label: "訂單管理", icon: "📋" },
  { href: "/admin/users", label: "用戶管理", icon: "👥" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="glass-strong fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[rgba(148,163,184,0.1)]">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-[rgba(148,163,184,0.1)] px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] to-[#3b82f6]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
            <span className="gradient-text text-lg font-bold">VeloCity</span>
          </Link>
          <span className="ml-auto rounded-md bg-[rgba(239,68,68,0.15)] px-2 py-0.5 text-[10px] font-bold uppercase text-[#f87171]">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[rgba(34,197,94,0.15)] text-[#4ade80]"
                    : "text-[#94a3b8] hover:bg-[rgba(148,163,184,0.08)] hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[rgba(148,163,184,0.1)] px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-[#94a3b8] transition-all hover:bg-[rgba(148,163,184,0.08)] hover:text-white"
          >
            ← 返回前台
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
