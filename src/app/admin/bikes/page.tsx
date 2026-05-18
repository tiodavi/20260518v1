"use client";

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

type BikeForm = {
  name: string;
  type: "ROAD" | "MOUNTAIN" | "ELECTRIC";
  imageUrl: string;
  pricePerHour: number;
  pricePerDay: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  description: string;
};

const defaultForm: BikeForm = {
  name: "",
  type: "ROAD",
  imageUrl: "",
  pricePerHour: 50,
  pricePerDay: 300,
  status: "AVAILABLE",
  description: "",
};

export default function AdminBikesPage() {
  const { data: bikes, isLoading, refetch } = api.bike.getAll.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BikeForm>(defaultForm);

  const createMutation = api.bike.create.useMutation({
    onSuccess: () => {
      void refetch();
      closeModal();
    },
  });

  const updateMutation = api.bike.update.useMutation({
    onSuccess: () => {
      void refetch();
      closeModal();
    },
  });

  const deleteMutation = api.bike.delete.useMutation({
    onSuccess: () => void refetch(),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (bike: {
    id: number;
    name: string;
    type: "ROAD" | "MOUNTAIN" | "ELECTRIC";
    imageUrl: string | null;
    pricePerHour: number;
    pricePerDay: number;
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
    description: string | null;
  }) => {
    setForm({
      name: bike.name,
      type: bike.type,
      imageUrl: bike.imageUrl ?? "",
      pricePerHour: bike.pricePerHour,
      pricePerDay: bike.pricePerDay,
      status: bike.status,
      description: bike.description ?? "",
    });
    setEditingId(bike.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...form,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
      });
    } else {
      createMutation.mutate({
        ...form,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
      });
    }
  };

  return (
    <div>
      <div className="animate-fade-in mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">車輛管理</h1>
          <p className="text-sm text-[#94a3b8]">新增、編輯或管理系統車輛</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + 新增車輛
        </button>
      </div>

      {/* Table */}
      <div className="glass animate-slide-up overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.1)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  車款
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  類型
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  每小時
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  每日
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
                ? [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-5 w-32 rounded bg-[rgba(148,163,184,0.1)]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-16 rounded bg-[rgba(148,163,184,0.1)]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-12 rounded bg-[rgba(148,163,184,0.1)]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-12 rounded bg-[rgba(148,163,184,0.1)]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-16 rounded bg-[rgba(148,163,184,0.1)]" />
                      </td>
                      <td className="px-6 py-4" />
                    </tr>
                  ))
                : bikes?.map((bike) => (
                    <tr
                      key={bike.id}
                      className="border-b border-[rgba(148,163,184,0.05)] transition-colors hover:bg-[rgba(148,163,184,0.03)]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {bike.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94a3b8]">
                        {typeLabels[bike.type] ?? bike.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        ${bike.pricePerHour}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        ${bike.pricePerDay}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${statusBadge[bike.status] ?? "badge-gray"}`}
                        >
                          {statusLabels[bike.status] ?? bike.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(bike)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#60a5fa] transition-colors hover:bg-[rgba(59,130,246,0.1)]"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("確定要刪除此車輛嗎？")) {
                                deleteMutation.mutate({ id: bike.id });
                              }
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#f87171] transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {bikes?.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-3 text-4xl">🚲</div>
            <p className="text-[#94a3b8]">尚未新增任何車輛</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-strong animate-slide-up w-full max-w-lg rounded-2xl p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
              {editingId ? "編輯車輛" : "新增車輛"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                  車款名稱 *
                </label>
                <input
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="例：Giant TCR Advanced"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    類型 *
                  </label>
                  <select
                    className="input-field"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value as BikeForm["type"],
                      }))
                    }
                  >
                    <option value="ROAD">公路車</option>
                    <option value="MOUNTAIN">登山車</option>
                    <option value="ELECTRIC">電輔車</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    狀態 *
                  </label>
                  <select
                    className="input-field"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as BikeForm["status"],
                      }))
                    }
                  >
                    <option value="AVAILABLE">可租借</option>
                    <option value="RENTED">已出租</option>
                    <option value="MAINTENANCE">維修中</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    每小時 (TWD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="input-field"
                    value={form.pricePerHour}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pricePerHour: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    每日 (TWD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="input-field"
                    value={form.pricePerDay}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pricePerDay: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                  圖片 URL
                </label>
                <input
                  className="input-field"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://example.com/bike.jpg"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                  描述
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-y"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="車輛詳細描述..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "儲存中..."
                    : editingId
                      ? "更新"
                      : "新增"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
