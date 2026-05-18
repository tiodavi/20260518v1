"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
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

export default function BikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bikeId = Number(params.id);

  const { data: bike, isLoading } = api.bike.getById.useQuery({ id: bikeId });

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const createRental = api.rental.create.useMutation({
    onSuccess: () => {
      setBookingSuccess(true);
      setBookingError("");
    },
    onError: (err) => {
      setBookingError(err.message);
    },
  });

  // Calculate estimated price
  const estimated = useMemo(() => {
    if (!startDate || !endDate || !bike) return null;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();

    if (diffMs <= 0) return null;

    const hours = diffMs / (1000 * 60 * 60);
    const days = Math.floor(hours / 24);
    const remainingHours = Math.ceil(hours % 24);

    let total = 0;
    if (days > 0) {
      total = days * bike.pricePerDay + remainingHours * bike.pricePerHour;
    } else {
      total = Math.ceil(hours) * bike.pricePerHour;
    }

    return { hours: Math.ceil(hours), days, remainingHours, total };
  }, [startDate, startTime, endDate, endTime, bike]);

  const handleBooking = () => {
    if (!startDate || !endDate) {
      setBookingError("請選擇租借日期與時間");
      return;
    }
    if (!estimated || estimated.total <= 0) {
      setBookingError("結束時間必須在開始時間之後");
      return;
    }

    createRental.mutate({
      bikeId,
      startTime: new Date(`${startDate}T${startTime}`).toISOString(),
      endTime: new Date(`${endDate}T${endTime}`).toISOString(),
      totalPrice: estimated.total,
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="glass animate-pulse rounded-2xl p-8">
          <div className="h-64 rounded-xl bg-[rgba(148,163,184,0.05)]" />
          <div className="mt-6 space-y-3">
            <div className="h-8 w-64 rounded bg-[rgba(148,163,184,0.1)]" />
            <div className="h-4 w-full rounded bg-[rgba(148,163,184,0.05)]" />
            <div className="h-4 w-3/4 rounded bg-[rgba(148,163,184,0.05)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">❌</div>
          <h2 className="mb-2 text-2xl font-bold text-white">找不到此車款</h2>
          <p className="mb-6 text-[#94a3b8]">此車輛可能已被移除或不存在</p>
          <Link href="/bikes" className="btn-primary">
            返回車款列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="animate-fade-in mb-8 flex items-center gap-2 text-sm text-[#94a3b8]">
        <Link href="/" className="transition-colors hover:text-white">
          首頁
        </Link>
        <span>/</span>
        <Link href="/bikes" className="transition-colors hover:text-white">
          車款列表
        </Link>
        <span>/</span>
        <span className="text-white">{bike.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Bike Info (3 cols) */}
        <div className="animate-fade-in lg:col-span-3">
          {/* Image */}
          <div className="glass mb-6 flex h-72 items-center justify-center overflow-hidden rounded-2xl sm:h-96">
            {bike.imageUrl ? (
              <img
                src={bike.imageUrl}
                alt={bike.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#detailGrad)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-30"
              >
                <defs>
                  <linearGradient
                    id="detailGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
              </svg>
            )}
          </div>

          {/* Details */}
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="badge badge-green">
                {typeLabels[bike.type] ?? bike.type}
              </span>
              <span className={`badge ${statusBadge[bike.status] ?? "badge-gray"}`}>
                {statusLabels[bike.status] ?? bike.status}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-white">{bike.name}</h1>

            <p className="mb-6 leading-relaxed text-[#94a3b8]">
              {bike.description ?? "這是一款優質的腳踏車，適合各種路況與騎行需求。"}
            </p>

            {/* Pricing cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[rgba(34,197,94,0.08)] p-4 text-center">
                <div className="mb-1 text-sm text-[#94a3b8]">每小時</div>
                <div className="text-2xl font-bold text-[#4ade80]">
                  ${bike.pricePerHour}
                </div>
              </div>
              <div className="rounded-xl bg-[rgba(59,130,246,0.08)] p-4 text-center">
                <div className="mb-1 text-sm text-[#94a3b8]">每日</div>
                <div className="text-2xl font-bold text-[#60a5fa]">
                  ${bike.pricePerDay}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Panel (2 cols) */}
        <div className="animate-slide-up lg:col-span-2">
          <div className="glass sticky top-24 rounded-2xl p-6">
            <h2 className="mb-6 text-xl font-bold text-white">預約租借</h2>

            {bookingSuccess ? (
              <div className="text-center">
                <div className="mb-4 text-5xl">✅</div>
                <h3 className="mb-2 text-xl font-bold text-[#4ade80]">
                  預約成功！
                </h3>
                <p className="mb-6 text-sm text-[#94a3b8]">
                  您的預約已送出，請至會員中心查看訂單狀態。
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard" className="btn-primary w-full">
                    前往會員中心
                  </Link>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="btn-secondary w-full"
                  >
                    再預約一次
                  </button>
                </div>
              </div>
            ) : bike.status !== "AVAILABLE" ? (
              <div className="text-center">
                <div className="mb-4 text-5xl">⚠️</div>
                <h3 className="mb-2 text-lg font-bold text-[#fbbf24]">
                  此車輛目前無法租借
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  狀態：{statusLabels[bike.status] ?? bike.status}
                </p>
              </div>
            ) : (
              <>
                {/* Start date/time */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    取車日期
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    取車時間
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                {/* End date/time */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    還車日期
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                    還車時間
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                {/* Price estimate */}
                {estimated && (
                  <div className="mb-6 rounded-xl bg-[rgba(34,197,94,0.08)] p-4">
                    <div className="mb-2 text-sm font-medium text-[#94a3b8]">
                      預估費用
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#4ade80]">
                        ${estimated.total}
                      </span>
                      <span className="text-sm text-[#94a3b8]">TWD</span>
                    </div>
                    <div className="mt-2 text-xs text-[#64748b]">
                      {estimated.days > 0
                        ? `${estimated.days} 天 ${estimated.remainingHours} 小時`
                        : `${estimated.hours} 小時`}
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="mb-4 rounded-lg bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#f87171]">
                    {bookingError}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={createRental.isPending || !estimated}
                  className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createRental.isPending ? "預約中..." : "確認預約"}
                </button>

                <p className="mt-3 text-center text-xs text-[#64748b]">
                  需要先登入才能預約
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
