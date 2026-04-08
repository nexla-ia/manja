"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import { MessageSquare, Plus, History, Settings, LogOut, Zap, Sparkles } from "lucide-react";

const TIPO_ICONS: Record<string, string> = {
  apresentacao: "🎯", trabalho: "📄", prova: "📋",
  resumo: "📚", plano: "🗓️", edital: "📜",
};

const TIPO_COLORS: Record<string, string> = {
  apresentacao: "#F59E0B", trabalho: "#3B82F6", prova: "#F43F5E",
  resumo: "#00E5A0", plano: "#8B5CF6", edital: "#F59E0B",
};

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [chats, setChats]     = useState<Chat[]>([]);
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
      if (prof)     setProfile(prof);
      if (chatList) setChats(chatList);
    }
    load();
  }, [pathname]);

  const handleNovoChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("chats").insert({ user_id: user.id, titulo: "Novo chat" }).select().single();
    if (data) router.push(`/chat/${data.id}`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className="w-60 flex flex-col h-screen flex-shrink-0"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--mint-dim), var(--blue))",
              boxShadow: "0 0 16px var(--glow-mint)",
            }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-syne font-bold text-lg grad-text">Manja.ai</span>
        </Link>
      </div>

      {/* Plan badge */}
      {profile?.plano === "free" && (
        <div className="mx-3 mt-3 rounded-xl p-3"
             style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={11} style={{ color: "var(--amber)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--amber)" }}>Plano Gratuito</span>
          </div>
          <Link href="/configuracoes" className="text-xs transition-colors hover:text-white"
                style={{ color: "var(--text-3)" }}>
            Upgrade Pro · R$49/mês →
          </Link>
        </div>
      )}

      {profile?.plano === "pro" && (
        <div className="mx-3 mt-3 rounded-xl p-3"
             style={{
               background: "linear-gradient(135deg, rgba(0,200,125,0.08), rgba(59,130,246,0.08))",
               border: "1px solid rgba(0,229,160,0.2)",
             }}>
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} style={{ color: "var(--mint)" }} />
            <span className="text-xs font-bold grad-text">Pro ativo ✓</span>
          </div>
        </div>
      )}

      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={handleNovoChat}
          className="btn-primary w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm"
        >
          <Plus size={15} />
          Novo chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.length > 0 && (
          <>
            <p className="text-xs font-bold px-2 mb-2 mt-1 uppercase tracking-widest"
               style={{ color: "var(--text-3)" }}>
              Recentes
            </p>
            {chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              const color    = TIPO_COLORS[chat.tipo_ultimo ?? ""] ?? "var(--mint)";
              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "relative flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all group overflow-hidden",
                    isActive ? "" : "hover:bg-white/[0.03]"
                  )}
                  style={{
                    color: isActive ? "var(--text)" : "var(--text-2)",
                    background: isActive ? "rgba(0,229,160,0.07)" : undefined,
                  }}
                >
                  {/* Active/hover left bar */}
                  <div
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full transition-all duration-200",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    )}
                    style={{ background: color }}
                  />
                  <span className="flex-shrink-0 ml-1 text-sm">
                    {TIPO_ICONS[chat.tipo_ultimo ?? ""] ?? "💬"}
                  </span>
                  <span className="truncate">{chat.titulo}</span>
                </Link>
              );
            })}
          </>
        )}
      </div>

      {/* Footer nav */}
      <div className="p-3 space-y-0.5" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { href: "/historico",    Icon: History,        label: "Histórico" },
          { href: "/configuracoes", Icon: Settings,      label: "Configurações" },
        ].map(({ href, Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all hover:bg-white/[0.04] hover:text-white"
            style={{ color: "var(--text-3)" }}
          >
            <Icon size={13} />
            {label}
          </Link>
        ))}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-all hover:bg-red-500/[0.06] hover:text-red-400"
          style={{ color: "var(--text-3)" }}
        >
          <LogOut size={13} />
          Sair
        </button>

        {profile && (
          <div className="flex items-center gap-2 px-2 pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}
            >
              {profile.nome?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>
                {profile.nome ?? "Estudante"}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-3)" }}>
                {profile.plano === "pro" ? "Pro" : "Gratuito"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
