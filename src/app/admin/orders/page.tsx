"use client";

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

const statusOptions = ["PENDING", "ACTIVE", "RETURNED", "OVERDUE", "CANCELLED"] as const;

export default function AdminOrdersPage() {
  const { data: rentals, isLoading, refetch } = api.rental.getAll.useQuery();

  const updateStatus = api.rental.updateStatus.useMutation({
    onSuccess: () => void refetch(),
  });

  return (
    <div>
      <div className="animate-fade-in mb-8">
        <h1 className="mb-1 text-2xl font-bold text-white">訂單管理</h1>
        <p className="text-sm text-[#94a3b8]">
          檢視與管理全系統租借訂單
        </p>
      </div>

      <div className="glass animate-slide-up overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  訂單 #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  用戶
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  車款
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  租借期間
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  金額
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  狀態
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-5 w-16 rounded bg-[rgba(148,163,184,0.1)]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rentals?.map((rental) => (
                    <tr
                      key={rental.id}
                      className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[rgba(148,163,184,0.03)]"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-[#94a3b8]">
                        #{rental.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {rental.user.name ?? "—"}
                        </div>
                        <div className="text-xs text-[#64748b]">
                          {rental.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {rental.bike.name}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#94a3b8]">
                        <div>
                          {new Date(rental.startTime).toLocaleDateString(
                            "zh-TW",
                          )}{" "}
                          {new Date(rental.startTime).toLocaleTimeString(
                            "zh-TW",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                        <div>
                          ~{" "}
                          {new Date(rental.endTime).toLocaleDateString(
                            "zh-TW",
                          )}{" "}
                          {new Date(rental.endTime).toLocaleTimeString(
                            "zh-TW",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        ${rental.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${rentalStatusBadge[rental.status] ?? "badge-gray"}`}
                        >
                          {rentalStatusLabels[rental.status] ?? rental.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="input-field max-w-[120px] py-1.5 text-xs"
                          value={rental.status}
                          onChange={(e) =>
                            updateStatus.mutate({
                              id: rental.id,
                              status: e.target.value as (typeof statusOptions)[number],
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {rentalStatusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {rentals && rentals.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-3 text-4xl">📋</div>
            <p className="text-[#94a3b8]">目前沒有任何訂單</p>
          </div>
        )}
      </div>
    </div>
  );
}
