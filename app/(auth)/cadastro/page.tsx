"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nome },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-white font-bold text-xl mb-2">Confirme seu email</h2>
        <p className="text-gray-400 text-sm">
          Enviamos um link de confirmação para <span className="text-green-400">{email}</span>.
          Acesse seu email e clique no link para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-green-500">Manja</span>.ai
        </h1>
        <p className="text-gray-400 text-sm mt-1">Crie sua conta grátis</p>
      </div>

      <form onSubmit={handleCadastro} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
            className="w-full bg-[#111a13] border border-[#1e2e20] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-600 transition"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full bg-[#111a13] border border-[#1e2e20] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-600 transition"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
            className="w-full bg-[#111a13] border border-[#1e2e20] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-600 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition"
        >
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        Já tem conta?{" "}
        <Link href="/login" className="text-green-500 hover:text-green-400 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  );
}
