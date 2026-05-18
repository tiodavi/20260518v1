"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = api.auth.register.useMutation({
    onSuccess: () => {
      router.push("/auth/signin?registered=1");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    if (password.length < 6) {
      setError("密碼至少需要 6 個字元");
      return;
    }

    register.mutate({ name, email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
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
            建立帳號
          </h1>
          <p className="mb-8 text-center text-sm text-[#94a3b8]">
            加入 VeloCity，開始您的騎行之旅
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                姓名
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                placeholder="至少 6 個字元"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#94a3b8]">
                確認密碼
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#f87171]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={register.isPending}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {register.isPending ? "註冊中..." : "建立帳號"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#94a3b8]">
            已有帳號？{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-[#4ade80] transition-colors hover:text-[#22c55e]"
            >
              登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
