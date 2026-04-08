import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Sparkles } from "lucide-react";

const TIPOS = [
  { tipo: "apresentacao", icon: "🎯", label: "Apresentação",    desc: "Slides prontos para apresentar" },
  { tipo: "trabalho",     icon: "📄", label: "Trabalho",         desc: "Documentos com formatação ABNT" },
  { tipo: "prova",        icon: "📋", label: "Prova",            desc: "Questões com gabarito" },
  { tipo: "resumo",       icon: "📚", label: "Resumo",           desc: "Resumos estruturados" },
  { tipo: "plano",        icon: "🗓️", label: "Plano de estudo",  desc: "Cronograma personalizado" },
  { tipo: "edital",       icon: "📜", label: "Edital",           desc: "Análise de concurso público" },
];

const TIPO_ICONS: Record<string, string> = {
  apresentacao: "🎯",
  trabalho: "📄",
  prova: "📋",
  resumo: "📚",
  plano: "🗓️",
  edital: "📜",
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

  async function createChat(tipo: string) {
    "use server";
    const s = await createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return;
    const { data } = await s.from("chats")
      .insert({ user_id: user.id, titulo: `Novo ${tipo}` })
      .select().single();
    if (data) redirect(`/chat/${data.id}`);
  }

  const primeiroNome = profile?.nome?.split(" ")[0] ?? "estudante";

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Boas vindas */}
      <div className="mb-10 animate-slide-up">
        <p className="text-sm mb-2" style={{ color: "#64748B" }}>
          Bem-vindo de volta 👋
        </p>
        <h1 className="font-syne font-bold text-4xl" style={{ color: "#F1F5F9" }}>
          Fala,{" "}
          <span className="gradient-text">{primeiroNome}!</span>
        </h1>
        <p className="mt-2 text-base" style={{ color: "#64748B" }}>
          O que vamos criar hoje?
        </p>
      </div>

      {/* Tipos de material */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {TIPOS.map((t, i) => (
          <Link
            key={t.tipo}
            href="/chat/novo"
            className="card-gradient-border group cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-slide-up"
            style={{
              background: "#14141E",
              border: "1px solid #1E1E2E",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                 style={{ background: "#1E1E2E" }}>
              {t.icon}
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: "#F1F5F9" }}>{t.label}</p>
            <p className="text-xs" style={{ color: "#64748B" }}>{t.desc}</p>
          </Link>
        ))}
      </div>

      {/* Chats recentes */}
      {recentChats && recentChats.length > 0 && (
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "360ms" }}>
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: "#F1F5F9" }}>
            <MessageSquare size={14} style={{ color: "#6EE7B7" }} />
            Chats recentes
          </h2>
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "#14141E", border: "1px solid #1E1E2E" }}
              >
                <span className="text-xl">
                  {TIPO_ICONS[chat.tipo_ultimo ?? ""] ?? "💬"}
                </span>
                <span className="text-sm truncate" style={{ color: "#CBD5E1" }}>{chat.titulo}</span>
                <span className="ml-auto text-xs flex-shrink-0" style={{ color: "#334155" }}>
                  {new Date(chat.atualizado_em).toLocaleDateString("pt-BR")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Plano free CTA */}
      {profile?.plano === "free" && (
        <div className="rounded-2xl p-6 flex items-center justify-between animate-slide-up"
             style={{
               background: "linear-gradient(135deg, rgba(110,231,183,0.08) 0%, rgba(59,130,246,0.08) 50%, rgba(245,158,11,0.08) 100%)",
               border: "1px solid rgba(110,231,183,0.2)",
               animationDelay: "420ms",
             }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="font-syne font-bold text-lg" style={{ color: "#F1F5F9" }}>Desbloqueie o plano Pro</p>
              <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
                Gerações ilimitadas, PPTX real, análise de editais e muito mais.
              </p>
            </div>
          </div>
          <Link
            href="/configuracoes"
            className="btn-shimmer text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all flex-shrink-0"
            style={{ boxShadow: "0 4px 20px rgba(110,231,183,0.3)" }}
          >
            R$ 49/mês →
          </Link>
        </div>
      )}
    </div>
  );
}
