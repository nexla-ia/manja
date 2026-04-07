import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Presentation, ClipboardList, Calendar, Scroll } from "lucide-react";

const TIPOS = [
  { tipo: "apresentacao", icon: "🎯", label: "Apresentação", desc: "Slides prontos para apresentar", cor: "green" },
  { tipo: "trabalho",     icon: "📄", label: "Trabalho",     desc: "Documentos com formatação ABNT", cor: "blue" },
  { tipo: "prova",        icon: "📋", label: "Prova",        desc: "Questões com gabarito", cor: "purple" },
  { tipo: "resumo",       icon: "📚", label: "Resumo",       desc: "Resumos estruturados", cor: "orange" },
  { tipo: "plano",        icon: "🗓️", label: "Plano de estudo", desc: "Cronograma personalizado", cor: "pink" },
  { tipo: "edital",       icon: "📜", label: "Edital",       desc: "Análise de concurso público", cor: "yellow" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: recentChats } = await supabase
    .from("chats").select("*").eq("user_id", user.id)
    .order("atualizado_em", { ascending: false }).limit(5);

  // Novo chat
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

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Boas vindas */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Oi, {profile?.nome?.split(" ")[0] ?? "estudante"}! 👋
        </h1>
        <p className="text-gray-400 mt-1">O que vamos criar hoje?</p>
      </div>

      {/* Tipos de material */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {TIPOS.map((t) => (
          <Link
            key={t.tipo}
            href="/chat/novo"
            className="bg-[#0d1410] border border-[#1e2e20] hover:border-green-700 rounded-2xl p-5 transition group cursor-pointer"
          >
            <div className="text-3xl mb-3">{t.icon}</div>
            <p className="text-white font-semibold text-sm">{t.label}</p>
            <p className="text-gray-500 text-xs mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>

      {/* Chats recentes */}
      {recentChats && recentChats.length > 0 && (
        <div>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <BookOpen size={14} className="text-green-500" />
            Chats recentes
          </h2>
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center gap-3 bg-[#0d1410] border border-[#1e2e20] hover:border-green-700 rounded-xl px-4 py-3 transition"
              >
                <span className="text-lg">
                  {chat.tipo_ultimo === "apresentacao" ? "🎯" :
                   chat.tipo_ultimo === "trabalho" ? "📄" :
                   chat.tipo_ultimo === "prova" ? "📋" :
                   chat.tipo_ultimo === "resumo" ? "📚" :
                   chat.tipo_ultimo === "plano" ? "🗓️" :
                   chat.tipo_ultimo === "edital" ? "📜" : "💬"}
                </span>
                <span className="text-gray-300 text-sm truncate">{chat.titulo}</span>
                <span className="ml-auto text-gray-600 text-xs flex-shrink-0">
                  {new Date(chat.atualizado_em).toLocaleDateString("pt-BR")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Plano free CTA */}
      {profile?.plano === "free" && (
        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-green-800/10 border border-green-700/30 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-bold">Desbloqueie o plano Pro</p>
            <p className="text-gray-400 text-sm mt-1">Gerações ilimitadas, PPTX real, análise de editais e muito mais.</p>
          </div>
          <Link
            href="/configuracoes"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition flex-shrink-0"
          >
            R$ 49/mês →
          </Link>
        </div>
      )}
    </div>
  );
}
