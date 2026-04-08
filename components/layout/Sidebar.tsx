"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import {
  MessageSquare, Plus, History, Settings,
  LogOut, Zap, Sparkles,
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
    <aside className="w-64 flex flex-col h-screen flex-shrink-0" style={{ background: "#0F0F17", borderRight: "1px solid #1E1E2E" }}>
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: "1px solid #1E1E2E" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center animate-glow"
               style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-syne font-bold text-xl gradient-text">
            Manja.ai
          </span>
        </Link>
      </div>

      {/* Badge do plano */}
      {profile?.plano === "free" && (
        <div className="mx-3 mt-3 rounded-xl p-3" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={13} style={{ color: "#F59E0B" }} />
            <span className="text-xs font-semibold" style={{ color: "#F59E0B" }}>Plano Gratuito</span>
          </div>
          <Link href="/configuracoes" className="text-xs transition" style={{ color: "#64748B" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F59E0B")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>
            Upgrade para Pro → R$49/mês
          </Link>
        </div>
      )}

      {profile?.plano === "pro" && (
        <div className="mx-3 mt-3 rounded-xl p-3 animate-glow"
             style={{ background: "linear-gradient(135deg, rgba(110,231,183,0.08), rgba(59,130,246,0.08))", border: "1px solid rgba(110,231,183,0.2)" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={13} style={{ color: "#6EE7B7" }} />
            <span className="text-xs font-semibold gradient-text">Plano Pro ativo ✓</span>
          </div>
        </div>
      )}

      {/* Botão Novo chat */}
      <div className="p-3">
        <button
          onClick={handleNovoChat}
          className="btn-shimmer w-full flex items-center gap-2 text-white rounded-xl px-3 py-2.5 text-sm font-semibold transition-all group"
          style={{ boxShadow: "0 4px 15px rgba(110,231,183,0.2)" }}
        >
          <Plus size={16} />
          Novo chat
        </button>
      </div>

      {/* Histórico */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-semibold px-2 mb-2 uppercase tracking-wider" style={{ color: "#64748B" }}>
              Recentes
            </p>
            {chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "relative flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all group overflow-hidden",
                    isActive ? "text-white" : "text-[#64748B] hover:text-white"
                  )}
                  style={isActive ? { background: "rgba(110,231,183,0.08)" } : {}}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                  {/* Indicador colorido esquerdo no hover/ativo */}
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full transition-all",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  style={{ background: "linear-gradient(180deg, #6EE7B7, #3B82F6)" }} />

                  <span className="text-base flex-shrink-0 ml-1">
                    {chat.tipo_ultimo ? TIPO_ICONS[chat.tipo_ultimo] : "💬"}
                  </span>
                  <span className="truncate">{chat.titulo}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-1" style={{ borderTop: "1px solid #1E1E2E" }}>
        <Link href="/historico"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all"
          style={{ color: "#64748B" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F1F5F9"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; (e.currentTarget as HTMLElement).style.background = ""; }}>
          <History size={15} />
          Histórico completo
        </Link>
        <Link href="/configuracoes"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all"
          style={{ color: "#64748B" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F1F5F9"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; (e.currentTarget as HTMLElement).style.background = ""; }}>
          <Settings size={15} />
          Configurações
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all"
          style={{ color: "#64748B" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#EF4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; (e.currentTarget as HTMLElement).style.background = ""; }}>
          <LogOut size={15} />
          Sair
        </button>

        {profile && (
          <div className="flex items-center gap-2 px-2 pt-2 mt-1" style={{ borderTop: "1px solid #1E1E2E" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                 style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
              {profile.nome?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-xs truncate" style={{ color: "#94A3B8" }}>{profile.nome ?? "Estudante"}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
