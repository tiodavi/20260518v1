"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email 或密碼錯誤，請重新輸入");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#3b82f6]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
            </svg>
          </div>
          <span className="gradient-text text-2xl font-bold">VeloCity</span>
        </Link>
      </div>

      <div className="glass rounded-2xl p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          歡迎回來
        </h1>
        <p className="mb-8 text-center text-sm text-[#94a3b8]">
          登入您的 VeloCity 帳號
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
              Email
            </label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
              密碼
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#f87171]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#94a3b8]">
          還沒有帳號？{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[#4ade80] transition-colors hover:text-[#22c55e]"
          >
            立即註冊
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<div className="animate-pulse text-[#94a3b8]">載入中...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
