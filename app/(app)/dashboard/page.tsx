import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";

const TIPOS = [
  { tipo: "apresentacao", icon: "🎯", label: "Apresentação",    desc: "Slides prontos pra apresentar",  color: "#F59E0B" },
  { tipo: "trabalho",     icon: "📄", label: "Trabalho",         desc: "Formatação ABNT automática",     color: "#3B82F6" },
  { tipo: "prova",        icon: "📋", label: "Prova de estudo",  desc: "Questões com gabarito",          color: "#F43F5E" },
  { tipo: "resumo",       icon: "📚", label: "Resumo",           desc: "Resumos estruturados",           color: "#00E5A0" },
  { tipo: "plano",        icon: "🗓️", label: "Plano de estudo",  desc: "Cronograma personalizado",       color: "#8B5CF6" },
  { tipo: "edital",       icon: "📜", label: "Edital",           desc: "Análise de concurso público",    color: "#F59E0B" },
];

const TIPO_COLORS: Record<string, string> = {
  apresentacao: "#F59E0B", trabalho: "#3B82F6", prova: "#F43F5E",
  resumo: "#00E5A0", plano: "#8B5CF6", edital: "#F59E0B",
};

const TIPO_ICONS: Record<string, string> = {
  apresentacao: "🎯", trabalho: "📄", prova: "📋",
  resumo: "📚", plano: "🗓️", edital: "📜",
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
      {/* ── Top bar ─────────────────────── */}
      <div className="sticky top-0 z-10 px-8 py-4 flex items-center justify-between"
           style={{
             background: "rgba(6,6,15,0.85)",
             backdropFilter: "blur(16px)",
             borderBottom: "1px solid var(--border)",
           }}>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Dashboard</p>
        <Link href="/chat/novo" className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold">
          <span>+ Novo chat</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* ── Greeting ────────────────────── */}
        <div className="mb-10 anim-fade-up">
          <p className="text-sm mb-1.5" style={{ color: "var(--text-3)" }}>{saudacao} 👋</p>
          <h1 className="font-syne font-extrabold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
            Fala,{" "}
            <span className="grad-text">{primeiroNome}!</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
            {profile?.plano === "pro"
              ? "Plano Pro ativo · gerações ilimitadas."
              : `${5 - (profile?.geracoes_mes ?? 0)} gerações restantes este mês.`}
          </p>
        </div>

        {/* ── Material grid ───────────────── */}
        <div className="mb-12">
          <h2 className="font-syne font-bold text-sm mb-4 tracking-wide uppercase" style={{ color: "var(--text-3)" }}>
            O que criar hoje?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIPOS.map((t, i) => (
              <Link
                key={t.tipo}
                href="/chat/novo"
                className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl anim-fade-up cursor-pointer relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  animationDelay: `${i * 55}ms`,
                }}
              >
                {/* Glow on hover via pseudo-element */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                     style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}0D, transparent 70%)` }} />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110"
                       style={{ background: `${t.color}14` }}>
                    {t.icon}
                  </div>
                  <p className="font-syne font-bold text-sm mb-1">{t.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent chats ────────────────── */}
        {recentChats && recentChats.length > 0 && (
          <div className="mb-10 anim-fade-up" style={{ animationDelay: "380ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-sm tracking-wide uppercase" style={{ color: "var(--text-3)" }}>
                Chats recentes
              </h2>
              <Link href="/historico" className="text-xs transition-colors hover:text-white flex items-center gap-1"
                    style={{ color: "var(--text-3)" }}>
                Ver todos <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentChats.map((chat) => {
                const color = TIPO_COLORS[chat.tipo_ultimo ?? ""] ?? "var(--mint)";
                return (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                         style={{ background: `${color}14` }}>
                      {TIPO_ICONS[chat.tipo_ultimo ?? ""] ?? "💬"}
                    </div>
                    <span className="text-sm truncate flex-1 group-hover:text-white transition-colors"
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

        {/* ── Pro CTA ─────────────────────── */}
        {profile?.plano === "free" && (
          <div className="rounded-3xl p-7 flex items-center justify-between gap-6 anim-fade-up relative overflow-hidden"
               style={{
                 background: "linear-gradient(135deg, rgba(0,200,125,0.08), rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
                 border: "1px solid rgba(0,229,160,0.2)",
                 animationDelay: "440ms",
               }}>
            {/* Top shimmer line */}
            <div className="absolute top-0 left-8 right-8 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, var(--mint), transparent)" }} />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 8px 24px var(--glow-mint)" }}>
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="font-syne font-bold text-base mb-0.5">Desbloqueie o plano Pro</p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>
                  Gerações ilimitadas, PPTX real, análise de editais e muito mais.
                </p>
              </div>
            </div>

            <Link href="/configuracoes"
                  className="btn-primary px-5 py-3 rounded-2xl text-sm font-bold flex-shrink-0 flex items-center gap-2">
              R$ 49/mês <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
