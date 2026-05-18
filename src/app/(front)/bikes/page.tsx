"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

const typeLabels: Record<string, string> = {
  ROAD: "公路車",
  MOUNTAIN: "登山車",
  ELECTRIC: "電輔車",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "可租借",
  RENTED: "已出租",
  MAINTENANCE: "維修中",
};

const statusBadge: Record<string, string> = {
  AVAILABLE: "badge-green",
  RENTED: "badge-red",
  MAINTENANCE: "badge-yellow",
};

export default function BikesPage() {
  const [filters, setFilters] = useState<{
    type?: "ROAD" | "MOUNTAIN" | "ELECTRIC";
    status?: "AVAILABLE" | "RENTED" | "MAINTENANCE";
    search?: string;
  }>({});

  const { data: bikes, isLoading } = api.bike.getAll.useQuery(
    Object.keys(filters).length > 0 ? filters : undefined,
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(34,197,94,0.05)] to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="animate-fade-in mb-4 text-3xl font-bold sm:text-4xl">
            探索<span className="gradient-text">車款</span>
          </h1>
          <p className="animate-fade-in text-[#94a3b8]">
            瀏覽我們的全系列腳踏車，找到最適合您的騎行夥伴
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass animate-slide-up mb-8 flex flex-wrap gap-4 rounded-2xl p-4">
          {/* Search */}
          <input
            type="text"
            placeholder="搜尋車款名稱..."
            className="input-field max-w-xs"
            value={filters.search ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                search: e.target.value || undefined,
              }))
            }
          />

          {/* Type filter */}
          <select
            className="input-field max-w-[160px]"
            value={filters.type ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                type: (e.target.value || undefined) as typeof f.type,
              }))
            }
          >
            <option value="">全部類型</option>
            <option value="ROAD">公路車</option>
            <option value="MOUNTAIN">登山車</option>
            <option value="ELECTRIC">電輔車</option>
          </select>

          {/* Status filter */}
          <select
            className="input-field max-w-[160px]"
            value={filters.status ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                status: (e.target.value || undefined) as typeof f.status,
              }))
            }
          >
            <option value="">全部狀態</option>
            <option value="AVAILABLE">可租借</option>
            <option value="RENTED">已出租</option>
            <option value="MAINTENANCE">維修中</option>
          </select>

          {/* Clear */}
          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => setFilters({})}
              className="text-sm text-[#94a3b8] transition-colors hover:text-white"
            >
              清除篩選
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass animate-pulse rounded-2xl"
              >
                <div className="h-48 rounded-t-2xl bg-[rgba(148,163,184,0.05)]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 rounded bg-[rgba(148,163,184,0.1)]" />
                  <div className="h-6 w-40 rounded bg-[rgba(148,163,184,0.1)]" />
                  <div className="h-4 w-full rounded bg-[rgba(148,163,184,0.05)]" />
                  <div className="h-8 w-24 rounded bg-[rgba(148,163,184,0.1)]" />
                </div>
              </div>
            ))}
          </div>
        ) : bikes && bikes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.map((bike, i) => (
              <Link
                key={bike.id}
                href={`/bikes/${bike.id}`}
                className={`card-hover glass animate-fade-in stagger-${Math.min(i + 1, 6)} group block overflow-hidden rounded-2xl`}
              >
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[rgba(34,197,94,0.08)] to-[rgba(59,130,246,0.08)]">
                  {bike.imageUrl ? (
                    <img
                      src={bike.imageUrl}
                      alt={bike.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-30 transition-all group-hover:scale-110 group-hover:opacity-60"
                    >
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                    </svg>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="badge badge-green text-xs">
                      {typeLabels[bike.type] ?? bike.type}
                    </span>
                    <span
                      className={`badge ${statusBadge[bike.status] ?? "badge-gray"} text-xs`}
                    >
                      {statusLabels[bike.status] ?? bike.status}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-[#4ade80]">
                    {bike.name}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-[#94a3b8]">
                    {bike.description ?? "優質腳踏車，適合各種路況。"}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#4ade80]">
                      ${bike.pricePerHour}
                    </span>
                    <span className="text-sm text-[#94a3b8]">/小時</span>
                    <span className="ml-2 text-sm text-[#64748b]">
                      | ${bike.pricePerDay}/天
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-white">
              找不到符合條件的車款
            </h3>
            <p className="mb-6 text-[#94a3b8]">
              請嘗試調整篩選條件或搜尋其他關鍵字
            </p>
            <button
              onClick={() => setFilters({})}
              className="btn-primary"
            >
              清除所有篩選
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
