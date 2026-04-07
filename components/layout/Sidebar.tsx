"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import {
  MessageSquare, Plus, History, Settings,
  LogOut, Zap, BookOpen,
} from "lucide-react";

const TIPO_ICONS: Record<string, string> = {
  apresentacao: "🎯",
  trabalho: "📄",
  prova: "📋",
  resumo: "📚",
  plano: "🗓️",
  edital: "📜",
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [chats, setChats] = useState<Chat[]>([]);
  const [profile, setProfile] = useState<{ nome: string; plano: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: prof }, { data: chatList }] = await Promise.all([
        supabase.from("profiles").select("nome, plano").eq("id", user.id).single(),
        supabase.from("chats").select("*").eq("user_id", user.id)
          .order("atualizado_em", { ascending: false }).limit(20),
      ]);

      if (prof) setProfile(prof);
      if (chatList) setChats(chatList);
    }
    load();
  }, [pathname]);

  const handleNovoChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("chats")
      .insert({ user_id: user.id, titulo: "Novo chat" })
      .select()
      .single();

    if (data) router.push(`/chat/${data.id}`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#0d1410] border-r border-[#1e2e20] flex flex-col h-screen flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#1e2e20]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen size={20} className="text-green-500" />
          <span className="text-white font-bold text-lg">
            <span className="text-green-500">Manja</span>.ai
          </span>
        </Link>
      </div>

      {/* Plano */}
      {profile?.plano === "free" && (
        <div className="mx-3 mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} className="text-green-400" />
            <span className="text-green-400 text-xs font-semibold">Plano Gratuito</span>
          </div>
          <Link
            href="/configuracoes"
            className="text-xs text-gray-400 hover:text-green-400 transition"
          >
            Upgrade para Pro → R$49/mês
          </Link>
        </div>
      )}

      {profile?.plano === "pro" && (
        <div className="mx-3 mt-3 bg-green-600/10 border border-green-600/20 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-green-400" />
            <span className="text-green-400 text-xs font-semibold">Plano Pro ativo ✓</span>
          </div>
        </div>
      )}

      {/* Novo chat */}
      <div className="p-3">
        <button
          onClick={handleNovoChat}
          className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white rounded-xl px-3 py-2.5 text-sm font-semibold transition"
        >
          <Plus size={16} />
          Novo chat
        </button>
      </div>

      {/* Histórico */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.length > 0 && (
          <div className="mb-2">
            <p className="text-gray-600 text-xs font-semibold px-2 mb-1 uppercase tracking-wider">
              Recentes
            </p>
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition group",
                  pathname === `/chat/${chat.id}`
                    ? "bg-green-600/15 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#111a13]"
                )}
              >
                <span className="text-base flex-shrink-0">
                  {chat.tipo_ultimo ? TIPO_ICONS[chat.tipo_ultimo] : "💬"}
                </span>
                <span className="truncate">{chat.titulo}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2e20] p-3 space-y-1">
        <Link
          href="/historico"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a13] text-sm transition"
        >
          <History size={15} />
          Histórico completo
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#111a13] text-sm transition"
        >
          <Settings size={15} />
          Configurações
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#111a13] text-sm transition"
        >
          <LogOut size={15} />
          Sair
        </button>

        {profile && (
          <div className="flex items-center gap-2 px-2 pt-2 mt-1 border-t border-[#1e2e20]">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {profile.nome?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-gray-300 text-xs truncate">{profile.nome ?? "Estudante"}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
