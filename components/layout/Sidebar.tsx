"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import {
  Plus, Settings, LogOut, Zap, Sparkles,
  Layers, FileText, ClipboardList, BookOpen, CalendarDays, FileSearch, MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TIPO_META: Record<string, { Icon: LucideIcon; color: string }> = {
  apresentacao: { Icon: Layers,        color: "#F59E0B" },
  trabalho:     { Icon: FileText,      color: "#3B82F6" },
  prova:        { Icon: ClipboardList, color: "#F43F5E" },
  resumo:       { Icon: BookOpen,      color: "#00E5A0" },
  plano:        { Icon: CalendarDays,  color: "#8B5CF6" },
  edital:       { Icon: FileSearch,    color: "#F59E0B" },
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
    <aside className="w-60 flex flex-col h-screen flex-shrink-0"
           style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 0 16px var(--glow-mint)" }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-syne font-bold text-lg grad-text">Manja.ai</span>
        </Link>
      </div>

      {/* Plan badge */}
      {profile?.plano === "free" && (
        <div className="mx-3 mt-3 rounded-xl p-3"
             style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={10} style={{ color: "var(--amber)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>Plano Gratuito</span>
          </div>
          <Link href="/configuracoes" className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "var(--text-3)" }}>
            Upgrade Pro · R$49/mês →
          </Link>
        </div>
      )}

      {profile?.plano === "pro" && (
        <div className="mx-3 mt-3 rounded-xl p-3"
             style={{ background: "linear-gradient(135deg, rgba(0,200,125,0.07), rgba(59,130,246,0.07))", border: "1px solid rgba(0,229,160,0.15)" }}>
          <div className="flex items-center gap-1.5">
            <Sparkles size={10} style={{ color: "var(--mint)" }} />
            <span className="text-xs font-semibold grad-text">Pro ativo</span>
          </div>
        </div>
      )}

      {/* New chat */}
      <div className="p-3">
        <button onClick={handleNovoChat}
                className="btn-primary w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold">
          <Plus size={14} strokeWidth={2.5} />
          Novo chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.length > 0 && (
          <>
            <p className="text-xs font-semibold px-2 mb-2 mt-1 uppercase tracking-widest"
               style={{ color: "var(--text-3)", fontSize: "10px" }}>
              Recentes
            </p>
            {chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              const meta     = TIPO_META[chat.tipo_ultimo ?? ""];
              const color    = meta?.color ?? "var(--text-3)";
              const Icon     = meta?.Icon ?? MessageSquare;
              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 group overflow-hidden",
                    isActive ? "" : "hover:bg-white/[0.03]"
                  )}
                  style={{
                    color: isActive ? "var(--text)" : "var(--text-2)",
                    background: isActive ? `${color}0D` : undefined,
                  }}
                >
                  {/* Active indicator */}
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-300",
                    isActive ? "h-5 opacity-100" : "h-3 opacity-0 group-hover:opacity-40"
                  )} style={{ background: color }} />

                  <Icon size={12} className="flex-shrink-0 ml-1 transition-colors duration-200"
                        style={{ color: isActive ? color : "var(--text-3)" }} />
                  <span className="truncate">{chat.titulo}</span>
                </Link>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-0.5" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { href: "/configuracoes", Icon: Settings, label: "Configurações" },
        ].map(({ href, Icon, label }) => (
          <Link key={href} href={href}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
                style={{ color: "var(--text-3)" }}>
            <Icon size={13} />
            {label}
          </Link>
        ))}

        <button onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 hover:text-red-400"
                style={{ color: "var(--text-3)" }}>
          <LogOut size={13} />
          Sair
        </button>

        {profile && (
          <div className="flex items-center gap-2.5 px-2 pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}>
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
