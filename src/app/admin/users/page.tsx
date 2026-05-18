"use client";

import { api } from "~/trpc/react";

export default function AdminUsersPage() {
  const { data: users, isLoading } = api.user.getAll.useQuery();

  return (
    <div>
      <div className="animate-fade-in mb-8">
        <h1 className="mb-1 text-2xl font-bold text-white">用戶管理</h1>
        <p className="text-sm text-[#94a3b8]">檢視與管理系統註冊用戶</p>
      </div>

      <div className="glass animate-slide-up overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  用戶
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  角色
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  註冊時間
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      {[1, 2, 3, 4].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-5 w-24 rounded bg-[rgba(148,163,184,0.1)]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users?.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[rgba(148,163,184,0.03)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[rgba(34,197,94,0.2)] to-[rgba(59,130,246,0.2)]">
                            <span className="text-sm font-bold text-white">
                              {(user.name ?? user.email)[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-white">
                            {user.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94a3b8]">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            user.role === "ADMIN" ? "badge-red" : "badge-blue"
                          }`}
                        >
                          {user.role === "ADMIN" ? "管理員" : "會員"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94a3b8]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("zh-TW")
                          : "—"}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {users?.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-3 text-4xl">👥</div>
            <p className="text-[#94a3b8]">目前沒有註冊用戶</p>
          </div>
        )}
      </div>
    </div>
  );
}
