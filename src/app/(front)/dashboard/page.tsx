"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

const rentalStatusLabels: Record<string, string> = {
  PENDING: "待確認",
  ACTIVE: "租借中",
  RETURNED: "已歸還",
  OVERDUE: "逾期",
  CANCELLED: "已取消",
};

const rentalStatusBadge: Record<string, string> = {
  PENDING: "badge-yellow",
  ACTIVE: "badge-green",
  RETURNED: "badge-blue",
  OVERDUE: "badge-red",
  CANCELLED: "badge-gray",
};

export default function DashboardPage() {
  const { data: rentals, isLoading, refetch } = api.rental.getMyRentals.useQuery();

  const cancelMutation = api.rental.cancel.useMutation({
    onSuccess: () => void refetch(),
  });

  const activeRentals = rentals?.filter(
    (r) => r.status === "ACTIVE" || r.status === "PENDING",
  );
  const pastRentals = rentals?.filter(
    (r) =>
      r.status === "RETURNED" ||
      r.status === "CANCELLED" ||
      r.status === "OVERDUE",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="animate-fade-in mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          會員<span className="gradient-text">中心</span>
        </h1>
        <p className="text-[#94a3b8]">管理您的租借訂單與帳號資訊</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass animate-pulse rounded-2xl p-6">
              <div className="h-6 w-48 rounded bg-[rgba(148,163,184,0.1)]" />
              <div className="mt-4 h-4 w-full rounded bg-[rgba(148,163,184,0.05)]" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Active Rentals */}
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
              目前租借中
            </h2>

            {activeRentals && activeRentals.length > 0 ? (
              <div className="space-y-4">
                {activeRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="glass card-hover animate-fade-in rounded-2xl p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {rental.bike.name}
                          </h3>
                          <span
                            className={`badge ${rentalStatusBadge[rental.status] ?? "badge-gray"}`}
                          >
                            {rentalStatusLabels[rental.status] ?? rental.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#94a3b8]">
                          <span>
                            📅 {new Date(rental.startTime).toLocaleDateString("zh-TW")}{" "}
                            {new Date(rental.startTime).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span>→</span>
                          <span>
                            {new Date(rental.endTime).toLocaleDateString("zh-TW")}{" "}
                            {new Date(rental.endTime).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#4ade80]">
                            ${rental.totalPrice}
                          </div>
                          <div className="text-xs text-[#64748b]">TWD</div>
                        </div>
                        {rental.status === "PENDING" && (
                          <button
                            onClick={() => cancelMutation.mutate({ id: rental.id })}
                            disabled={cancelMutation.isPending}
                            className="btn-danger text-sm"
                          >
                            取消
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl py-12 text-center">
                <div className="mb-3 text-4xl">🚲</div>
                <p className="mb-4 text-[#94a3b8]">目前沒有進行中的租借</p>
                <Link href="/bikes" className="btn-primary text-sm">
                  立即瀏覽車款
                </Link>
              </div>
            )}
          </section>

          {/* History */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
              歷史紀錄
            </h2>

            {pastRentals && pastRentals.length > 0 ? (
              <div className="glass overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(148,163,184,0.1)]">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                          車款
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                          租借期間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                          金額
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                          狀態
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastRentals.map((rental) => (
                        <tr
                          key={rental.id}
                          className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[rgba(148,163,184,0.03)]"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-white">
                            {rental.bike.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#94a3b8]">
                            {new Date(rental.startTime).toLocaleDateString("zh-TW")}
                            {" ~ "}
                            {new Date(rental.endTime).toLocaleDateString("zh-TW")}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-white">
                            ${rental.totalPrice}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`badge ${rentalStatusBadge[rental.status] ?? "badge-gray"}`}
                            >
                              {rentalStatusLabels[rental.status] ?? rental.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl py-12 text-center">
                <p className="text-[#94a3b8]">尚無歷史租借紀錄</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
