import Link from "next/link";
import { api } from "~/trpc/server";

export default async function HomePage() {
  const [featuredBikes, stats] = await Promise.all([
    api.bike.getFeatured(),
    api.bike.getStats(),
  ]);

  const bikeTypeLabels: Record<string, string> = {
    ROAD: "公路車",
    MOUNTAIN: "登山車",
    ELECTRIC: "電輔車",
  };

  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#022c22]" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-[rgba(34,197,94,0.08)] blur-3xl" />
        <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-[rgba(59,130,246,0.06)] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="animate-fade-in">
              <div className="badge badge-green mb-6">🚲 智慧租借平台</div>
              <h1 className="mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
                您的下一段旅程
                <br />
                <span className="gradient-text">從這裡開始</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#94a3b8]">
                VeloCity
                提供頂級公路車、專業登山車與省力電輔車。線上即時預約，快速取車，讓每一段路程都充滿自由。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/bikes" className="btn-primary px-8 py-3 text-base">
                  探索車款 →
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-secondary px-8 py-3 text-base"
                >
                  免費註冊
                </Link>
              </div>

              {/* Quick stats */}
              <div className="mt-12 flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {stats.total}+
                  </div>
                  <div className="text-sm text-[#94a3b8]">車輛總數</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4ade80]">
                    {stats.available}
                  </div>
                  <div className="text-sm text-[#94a3b8]">可租借</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#60a5fa]">
                    {stats.types}
                  </div>
                  <div className="text-sm text-[#94a3b8]">車款類型</div>
                </div>
              </div>
            </div>

            {/* Right: Decorative bike illustration */}
            <div className="animate-slide-up hidden lg:flex lg:justify-center">
              <div className="animate-float relative">
                <div className="glass flex h-80 w-80 items-center justify-center rounded-3xl">
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#heroGrad)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient
                        id="heroGrad"
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
                </div>
                {/* Orbiting dots */}
                <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-[#22c55e] opacity-60 blur-sm" />
                <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-[#3b82f6] opacity-40 blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              <span className="gradient-text">簡單三步驟</span>，即刻出發
            </h2>
            <p className="text-[#94a3b8]">
              從瀏覽到騎乘，只需幾分鐘
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "探索車款",
                desc: "瀏覽公路車、登山車、電輔車等多種選擇，依需求篩選最適合的車輛。",
              },
              {
                step: "02",
                icon: "📅",
                title: "線上預約",
                desc: "選擇租借日期與時段，系統自動計算費用，一鍵送出預約。",
              },
              {
                step: "03",
                icon: "🚴",
                title: "取車出發",
                desc: "至指定據點取車，享受您的騎行之旅。結束後歸還即可。",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`card-hover glass animate-fade-in stagger-${i + 1} rounded-2xl p-8`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="gradient-text text-sm font-bold">
                    STEP {item.step}
                  </span>
                </div>
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#94a3b8]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Bikes ────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(34,197,94,0.02)] to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                熱門<span className="gradient-text">推薦車款</span>
              </h2>
              <p className="text-[#94a3b8]">精選目前可租借的優質車輛</p>
            </div>
            <Link
              href="/bikes"
              className="btn-secondary hidden text-sm sm:inline-flex"
            >
              查看全部 →
            </Link>
          </div>

          {featuredBikes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBikes.map((bike, i) => (
                <Link
                  key={bike.id}
                  href={`/bikes/${bike.id}`}
                  className={`card-hover glass animate-fade-in stagger-${i + 1} group block overflow-hidden rounded-2xl`}
                >
                  {/* Image placeholder */}
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[rgba(34,197,94,0.1)] to-[rgba(59,130,246,0.1)]">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-40 transition-all group-hover:scale-110 group-hover:opacity-70"
                    >
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="badge badge-green text-xs">
                        {bikeTypeLabels[bike.type] ?? bike.type}
                      </span>
                      <span className="badge badge-blue text-xs">可租借</span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-white group-hover:text-[#4ade80] transition-colors">
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
              <div className="mb-4 text-5xl">🚲</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                即將上架
              </h3>
              <p className="text-[#94a3b8]">
                我們正在準備精選車款，敬請期待！
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/bikes" className="btn-secondary text-sm">
              查看全部車款 →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="glass animate-fade-in rounded-3xl p-12 sm:p-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              準備好<span className="gradient-text">出發</span>了嗎？
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-[#94a3b8]">
              立即免費註冊 VeloCity
              帳號，開始探索我們的多元車款，預約您的下一段精彩旅程。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup" className="btn-primary px-10 py-3 text-base">
                立即註冊 →
              </Link>
              <Link href="/bikes" className="btn-secondary px-10 py-3 text-base">
                先逛逛車款
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
