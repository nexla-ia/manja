"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS, formatTokens, estimarCustoReais } from "@/lib/stripe/plans";
import { Zap, MessageSquare, FileText, BarChart2, User, Crown } from "lucide-react";

function UsageBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = total === Infinity ? 0 : Math.min(100, (used / total) * 100);
  const warning = pct >= 80;
  const barColor = warning ? "var(--rose)" : color;
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: "var(--border)" }}>
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}66` }}
      />
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [email, setEmail]     = useState("");
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    })();
  }, []);

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-3)" }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--mint)" }} />
      </div>
    );
  }

  const isPro       = profile.plano === "pro";
  const plan        = PLANS[isPro ? "pro" : "free"];
  const tokens      = (profile.tokens_mes as number) ?? 0;
  const mensagens   = (profile.mensagens_mes as number) ?? 0;
  const geracoes    = (profile.geracoes_mes as number) ?? 0;
  const tokensLimit = plan.tokens_mes;
  const msgLimit    = plan.mensagens_mes;
  const gerLimit    = plan.geracoes;

  const stats = [
    {
      icon: <BarChart2 size={15} />,
      label: "Tokens usados",
      value: formatTokens(tokens),
      sub: tokensLimit === Infinity ? "Ilimitado" : `de ${formatTokens(tokensLimit as number)} (≈ ${estimarCustoReais(tokens)})`,
      used: tokens,
      total: tokensLimit as number,
      color: "var(--mint)",
    },
    {
      icon: <MessageSquare size={15} />,
      label: "Mensagens enviadas",
      value: String(mensagens),
      sub: msgLimit === Infinity ? "Ilimitado" : `de ${msgLimit} este mês`,
      used: mensagens,
      total: msgLimit as number,
      color: "var(--blue)",
    },
    {
      icon: <FileText size={15} />,
      label: "Arquivos gerados",
      value: String(geracoes),
      sub: gerLimit === Infinity ? "Ilimitado" : `de ${gerLimit} este mês`,
      used: geracoes,
      total: gerLimit as number,
      color: "var(--amber)",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 px-8 py-4"
           style={{ background: "rgba(6,6,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Configurações</p>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10 space-y-6">

        {/* Perfil */}
        <section className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-5">
            <User size={15} style={{ color: "var(--text-3)" }} />
            <h2 className="font-syne font-bold text-sm tracking-wide uppercase" style={{ color: "var(--text-3)" }}>Perfil</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nome", value: (profile.nome as string) ?? "—" },
              { label: "Email", value: email },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Uso do mês */}
        <section className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <BarChart2 size={15} style={{ color: "var(--text-3)" }} />
              <h2 className="font-syne font-bold text-sm tracking-wide uppercase" style={{ color: "var(--text-3)" }}>Uso este mês</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: isPro ? "rgba(0,229,160,0.12)" : "rgba(245,158,11,0.1)", color: isPro ? "var(--mint)" : "var(--amber)" }}>
              {isPro ? "✦ Pro" : "Free"}
            </span>
          </div>

          <div className="space-y-5">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2" style={{ color: "var(--text-2)" }}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{s.value}</span>
                    <span className="text-xs ml-1.5" style={{ color: "var(--text-3)" }}>{s.sub}</span>
                  </div>
                </div>
                {s.total !== Infinity && (
                  <UsageBar used={s.used} total={s.total} color={s.color} />
                )}
              </div>
            ))}
          </div>

          {!isPro && (
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Reset em 1º do próximo mês. Tokens são o volume de texto processado pelo modelo de IA.
              </p>
            </div>
          )}
        </section>

        {/* Plano */}
        <section className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-5">
            <Crown size={15} style={{ color: "var(--text-3)" }} />
            <h2 className="font-syne font-bold text-sm tracking-wide uppercase" style={{ color: "var(--text-3)" }}>Plano</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Free */}
            <div className="rounded-xl p-4 transition-all"
                 style={{
                   background: !isPro ? "rgba(245,158,11,0.05)" : "transparent",
                   border: `1px solid ${!isPro ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
                 }}>
              <p className="font-syne font-bold text-sm mb-1">Gratuito</p>
              <p className="font-bold text-xl mb-3" style={{ color: "var(--amber)" }}>R$ 0</p>
              <ul className="space-y-1.5">
                {PLANS.free.features.map((f, i) => (
                  <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "var(--text-3)" }}>
                    <span className="mt-0.5" style={{ color: "var(--border-hi)" }}>•</span> {f}
                  </li>
                ))}
              </ul>
              {!isPro && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--amber)" }}>✓ Plano atual</p>}
            </div>

            {/* Pro */}
            <div className="rounded-xl p-4 relative overflow-hidden transition-all"
                 style={{
                   background: isPro ? "rgba(0,229,160,0.05)" : "rgba(0,229,160,0.03)",
                   border: `1px solid ${isPro ? "rgba(0,229,160,0.3)" : "rgba(0,229,160,0.15)"}`,
                 }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, var(--mint), transparent)" }} />
              <div className="flex items-center gap-2 mb-1">
                <p className="font-syne font-bold text-sm">Pro</p>
                <Zap size={11} style={{ color: "var(--mint)" }} />
              </div>
              <p className="font-bold text-xl mb-3" style={{ color: "var(--mint)" }}>
                R$ 49<span className="text-sm font-normal" style={{ color: "var(--text-3)" }}>/mês</span>
              </p>
              <ul className="space-y-1.5">
                {PLANS.pro.features.map((f, i) => (
                  <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "var(--text-2)" }}>
                    <span className="mt-0.5" style={{ color: "var(--mint)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {isPro ? (
                <p className="mt-3 text-xs font-semibold" style={{ color: "var(--mint)" }}>✓ Plano atual</p>
              ) : (
                <button className="btn-primary mt-3 w-full rounded-xl py-2 text-xs font-bold">
                  Fazer upgrade
                </button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
