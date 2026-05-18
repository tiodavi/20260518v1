"use client";

import { api } from "~/trpc/react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = api.rental.getDashboardStats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-[rgba(148,163,184,0.1)]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass animate-pulse rounded-2xl p-6">
              <div className="h-8 w-24 rounded bg-[rgba(148,163,184,0.1)]" />
              <div className="mt-2 h-4 w-16 rounded bg-[rgba(148,163,184,0.05)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "今日營收",
      value: `$${stats.todayRevenue.toLocaleString()}`,
      sub: "TWD",
      color: "from-[#22c55e] to-[#16a34a]",
      icon: "💰",
    },
    {
      label: "目前出租",
      value: stats.rentedBikes.toString(),
      sub: `/ ${stats.totalBikes} 輛`,
      color: "from-[#3b82f6] to-[#2563eb]",
      icon: "🚴",
    },
    {
      label: "車輛妥善率",
      value: `${stats.bikeHealthRate}%`,
      sub: `${stats.maintenanceBikes} 輛維修中`,
      color: "from-[#f59e0b] to-[#d97706]",
      icon: "🔧",
    },
    {
      label: "進行中訂單",
      value: stats.activeRentals.toString(),
      sub: `總計 ${stats.totalRentals} 筆`,
      color: "from-[#8b5cf6] to-[#7c3aed]",
      icon: "📋",
    },
  ];

  return (
    <div>
      <div className="animate-fade-in mb-8">
        <h1 className="mb-2 text-2xl font-bold text-white">營運儀表板</h1>
        <p className="text-sm text-[#94a3b8]">
          即時掌握系統營運數據與關鍵指標
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`animate-fade-in stagger-${i + 1} card-hover glass rounded-2xl p-6`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <div
                className={`h-2 w-12 rounded-full bg-gradient-to-r ${card.color}`}
              />
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-[#94a3b8]">{card.label}</span>
              <span className="text-xs text-[#64748b]">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass animate-fade-in stagger-5 rounded-2xl p-6">
          <div className="mb-2 text-sm text-[#94a3b8]">總營收</div>
          <div className="text-2xl font-bold text-[#4ade80]">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#64748b]">TWD</div>
        </div>

        <div className="glass animate-fade-in stagger-5 rounded-2xl p-6">
          <div className="mb-2 text-sm text-[#94a3b8]">可租借車輛</div>
          <div className="text-2xl font-bold text-[#60a5fa]">
            {stats.availableBikes}
          </div>
          <div className="text-xs text-[#64748b]">
            / {stats.totalBikes} 輛
          </div>
        </div>

        <div className="glass animate-fade-in stagger-6 rounded-2xl p-6">
          <div className="mb-2 text-sm text-[#94a3b8]">註冊用戶</div>
          <div className="text-2xl font-bold text-[#c084fc]">
            {stats.totalUsers}
          </div>
          <div className="text-xs text-[#64748b]">名會員</div>
        </div>
      </div>
    </div>
  );
}
