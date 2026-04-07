import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const TIPO_ICONS: Record<string, string> = {
  apresentacao: "🎯", trabalho: "📄", prova: "📋",
  resumo: "📚", plano: "🗓️", edital: "📜",
};

export default async function HistoricoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: chats } = await supabase
    .from("chats").select("*").eq("user_id", user.id)
    .order("atualizado_em", { ascending: false });

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Histórico de chats</h1>

      {chats && chats.length > 0 ? (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center gap-3 bg-[#0d1410] border border-[#1e2e20] hover:border-green-700 rounded-xl px-4 py-3.5 transition"
            >
              <span className="text-xl">
                {chat.tipo_ultimo ? TIPO_ICONS[chat.tipo_ultimo] : "💬"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{chat.titulo}</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  {new Date(chat.atualizado_em).toLocaleString("pt-BR")}
                </p>
              </div>
              {chat.tipo_ultimo && (
                <span className="bg-green-600/10 text-green-400 text-xs rounded-full px-2.5 py-1 flex-shrink-0">
                  {chat.tipo_ultimo}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-gray-400">Nenhum chat ainda.</p>
          <Link href="/chat/novo" className="text-green-500 text-sm hover:text-green-400 mt-2 inline-block">
            Criar primeiro chat →
          </Link>
        </div>
      )}
    </div>
  );
}
