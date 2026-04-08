import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Sparkles,
  Layers, FileText, ClipboardList, BookOpen, CalendarDays, FileSearch, MessageSquare,
} from "lucide-react";
import { PLANS, formatTokens } from "@/lib/stripe/plans";
import type { LucideIcon } from "lucide-react";

const TIPOS: { tipo: string; Icon: LucideIcon; label: string; desc: string; color: string }[] = [
  { tipo: "apresentacao", Icon: Layers,        label: "Apresentação",    desc: "Slides prontos pra apresentar",  color: "#F59E0B" },
  { tipo: "trabalho",     Icon: FileText,       label: "Trabalho",        desc: "Formatação ABNT automática",     color: "#3B82F6" },
  { tipo: "prova",        Icon: ClipboardList,  label: "Prova de estudo", desc: "Questões com gabarito",          color: "#F43F5E" },
  { tipo: "resumo",       Icon: BookOpen,       label: "Resumo",          desc: "Resumos estruturados",           color: "#00E5A0" },
  { tipo: "plano",        Icon: CalendarDays,   label: "Plano de estudo", desc: "Cronograma personalizado",       color: "#8B5CF6" },
  { tipo: "edital",       Icon: FileSearch,     label: "Edital",          desc: "Análise de concurso público",    color: "#F59E0B" },
];

const TIPO_META: Record<string, { Icon: LucideIcon; color: string }> = {
  apresentacao: { Icon: Layers,        color: "#F59E0B" },
  trabalho:     { Icon: FileText,      color: "#3B82F6" },
  prova:        { Icon: ClipboardList, color: "#F43F5E" },
  resumo:       { Icon: BookOpen,      color: "#00E5A0" },
  plano:        { Icon: CalendarDays,  color: "#8B5CF6" },
  edital:       { Icon: FileSearch,    color: "#F59E0B" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: recentChats } = await supabase
    .from("chats").select("*").eq("user_id", user.id)
    .order("atualizado_em", { ascending: false }).limit(5);

  const primeiroNome = profile?.nome?.split(" ")[0] ?? "estudante";
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Top bar */}
      <div className="sticky top-0 z-10 px-8 py-4 flex items-center justify-between"
           style={{ background: "rgba(6,6,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Dashboard</p>
        <Link href="/chat/novo"
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold">
          + Novo chat
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Greeting */}
        <div className="mb-10 anim-fade-up">
          <p className="text-sm mb-1.5" style={{ color: "var(--text-3)" }}>{saudacao}</p>
          <h1 className="font-syne font-extrabold leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
            Fala, <span className="grad-text">{primeiroNome}!</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
            {profile?.plano === "pro"
              ? "Plano Pro ativo · gerações ilimitadas."
              : `${5 - (profile?.geracoes_mes ?? 0)} gerações restantes este mês.`}
          </p>

          {/* Usage mini-bar (free only) */}
          {profile?.plano !== "pro" && (
            <Link href="/configuracoes"
                  className="mt-4 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:border-white/10 w-fit"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              {(() => {
                const tokens = (profile?.tokens_mes as number) ?? 0;
                const limit  = PLANS.free.tokens_mes;
                const pct    = Math.min(100, (tokens / limit) * 100);
                const warn   = pct >= 80;
                return (
                  <>
                    <div>
                      <p className="text-xs mb-1.5" style={{ color: "var(--text-3)" }}>Uso do plano Free</p>
                      <div className="w-36 h-1 rounded-full" style={{ background: "var(--border)" }}>
                        <div className="h-1 rounded-full transition-all duration-700"
                             style={{ width: `${pct}%`, background: warn ? "var(--rose)" : "var(--mint)" }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">{formatTokens(tokens)}</p>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>de {formatTokens(limit)}</p>
                    </div>
                  </>
                );
              })()}
            </Link>
          )}
        </div>

        {/* Material grid */}
        <div className="mb-12">
          <h2 className="font-syne font-bold mb-4 uppercase tracking-widest"
              style={{ fontSize: "11px", color: "var(--text-3)" }}>
            O que criar hoje?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIPOS.map((t, i) => (
              <Link
                key={t.tipo}
                href="/chat/novo"
                className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden anim-fade-up"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {/* Radial glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                     style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}0D, transparent 65%)` }} />
                {/* Bottom border accent on hover */}
                <div className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: `linear-gradient(90deg, transparent, ${t.color}66, transparent)` }} />

                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                       style={{ background: `${t.color}14` }}>
                    <t.Icon size={18} style={{ color: t.color }} strokeWidth={1.5} />
                  </div>
                  <p className="font-syne font-bold text-sm mb-1">{t.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent chats */}
        {recentChats && recentChats.length > 0 && (
          <div className="mb-10 anim-fade-up" style={{ animationDelay: "360ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold uppercase tracking-widest"
                  style={{ fontSize: "11px", color: "var(--text-3)" }}>
                Recentes
              </h2>
              <Link href="/historico"
                    className="text-xs flex items-center gap-1 transition-colors duration-200 hover:text-white"
                    style={{ color: "var(--text-3)" }}>
                Ver todos <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-1.5">
              {recentChats.map((chat) => {
                const meta  = TIPO_META[chat.tipo_ultimo ?? ""];
                const color = meta?.color ?? "var(--text-3)";
                const Icon  = meta?.Icon ?? MessageSquare;
                return (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-px"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: `${color}12` }}>
                      <Icon size={13} style={{ color }} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm truncate flex-1 transition-colors duration-200 group-hover:text-white"
                          style={{ color: "var(--text-2)" }}>
                      {chat.titulo}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-3)" }}>
                      {new Date(chat.atualizado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Pro CTA */}
        {profile?.plano === "free" && (
          <div className="rounded-3xl p-7 flex items-center justify-between gap-6 anim-fade-up relative overflow-hidden"
               style={{
                 background: "linear-gradient(135deg, rgba(0,200,125,0.06), rgba(59,130,246,0.06))",
                 border: "1px solid rgba(0,229,160,0.15)",
                 animationDelay: "420ms",
               }}>
            <div className="absolute top-0 left-8 right-8 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, var(--mint), transparent)" }} />

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 8px 24px var(--glow-mint)" }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="font-syne font-bold text-base mb-0.5">Desbloqueie o plano Pro</p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>
                  Gerações ilimitadas, PPTX profissional, análise de editais e mais.
                </p>
              </div>
            </div>

            <Link href="/configuracoes"
                  className="btn-primary px-5 py-3 rounded-2xl text-sm font-bold flex-shrink-0 flex items-center gap-2">
              R$ 49/mês <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
