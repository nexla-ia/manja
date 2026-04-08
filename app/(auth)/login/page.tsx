"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="anim-fade-up">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl mb-1.5" style={{ letterSpacing: "-0.02em" }}>
          Bem-vindo de volta
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Entre na sua conta para continuar.</p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 text-sm font-semibold mb-6 transition-all"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-hi)",
          color: "var(--text)",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,229,160,0.3)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-hi)")}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Entrar com Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-3)" }}>ou</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "var(--rose)" }}>
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-2)" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="input-glow w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>Senha</label>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="input-glow w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "var(--text-2)" }}>
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold transition-colors hover:opacity-80 grad-text">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}
