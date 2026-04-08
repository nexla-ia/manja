"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const [nome, setNome]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const supabase = createClient();
  const router   = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nome } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="anim-fade-up">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl mb-1.5" style={{ letterSpacing: "-0.02em" }}>
          Crie sua conta
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Gratuito para começar. Sem cartão de crédito.</p>
      </div>

      <form onSubmit={handleCadastro} className="space-y-4">
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "var(--rose)" }}>
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-2)" }}>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome completo"
            required
            className="input-glow w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

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
          <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-2)" }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
            className="input-glow w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 rounded-2xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </button>
      </form>

      <p className="text-center text-xs mt-4" style={{ color: "var(--text-3)" }}>
        Ao criar conta você concorda com nossos termos de uso.
      </p>

      <p className="text-center text-sm mt-4" style={{ color: "var(--text-2)" }}>
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold transition-colors hover:opacity-80 grad-text">
          Entrar
        </Link>
      </p>
    </div>
  );
}
