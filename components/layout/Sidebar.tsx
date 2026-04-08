"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import {
  Plus, Settings, LogOut, Zap, Sparkles, MoreHorizontal,
  Pencil, Trash2, FolderPlus, FolderOpen, Folder, ChevronRight,
  Layers, FileText, ClipboardList, BookOpen, CalendarDays, FileSearch, MessageSquare, Check, X,
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

interface FolderItem {
  id: string;
  nome: string;
}

type ChatWithFolder = Chat;

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();

  const [chats, setChats]       = useState<ChatWithFolder[]>([]);
  const [folders, setFolders]   = useState<FolderItem[]>([]);
  const [profile, setProfile]   = useState<{ nome: string; plano: string } | null>(null);

  // UI state
  const [openMenu, setOpenMenu]           = useState<string | null>(null);   // chatId ou folderId com menu aberto
  const [renamingChat, setRenamingChat]   = useState<string | null>(null);
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue]     = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [movingChat, setMovingChat]       = useState<string | null>(null);    // chatId sendo movido
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const renameRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: prof }, { data: chatList }, { data: folderList }] = await Promise.all([
      supabase.from("profiles").select("nome, plano").eq("id", user.id).single(),
      supabase.from("chats").select("*").eq("user_id", user.id).order("atualizado_em", { ascending: false }).limit(40),
      supabase.from("folders").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
    ]);
    if (prof)        setProfile(prof);
    if (chatList)    setChats(chatList);
    if (folderList)  setFolders(folderList);
  }, []);

  useEffect(() => { load(); }, [pathname]);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if ((renamingChat || renamingFolder) && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingChat, renamingFolder]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleNovoChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("chats").insert({ user_id: user.id, titulo: "Novo chat" }).select().single();
    if (data) router.push(`/chat/${data.id}`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);
    setChats(prev => prev.filter(c => c.id !== id));
    if (pathname === `/chat/${id}`) router.push("/dashboard");
  };

  const confirmRenameChat = async () => {
    if (!renamingChat || !renameValue.trim()) return;
    await supabase.from("chats").update({ titulo: renameValue.trim() }).eq("id", renamingChat);
    setChats(prev => prev.map(c => c.id === renamingChat ? { ...c, titulo: renameValue.trim() } : c));
    setRenamingChat(null);
  };

  const confirmRenameFolder = async () => {
    if (!renamingFolder || !renameValue.trim()) return;
    await supabase.from("folders").update({ nome: renameValue.trim() }).eq("id", renamingFolder);
    setFolders(prev => prev.map(f => f.id === renamingFolder ? { ...f, nome: renameValue.trim() } : f));
    setRenamingFolder(null);
  };

  const deleteFolder = async (id: string) => {
    // Chats voltam para sem pasta
    await supabase.from("chats").update({ folder_id: null }).eq("folder_id", id);
    await supabase.from("folders").delete().eq("id", id);
    setFolders(prev => prev.filter(f => f.id !== id));
    setChats(prev => prev.map(c => c.folder_id === id ? { ...c, folder_id: null } : c));
  };

  const moveChatToFolder = async (chatId: string, folderId: string | null) => {
    await supabase.from("chats").update({ folder_id: folderId }).eq("id", chatId);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, folder_id: folderId } : c));
    setMovingChat(null);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("folders").insert({ user_id: user.id, nome: newFolderName.trim() }).select().single();
    if (data) {
      setFolders(prev => [...prev, data]);
      setExpandedFolders(prev => { const s = new Set(prev); s.add(data.id); return s; });
    }
    setCreatingFolder(false);
    setNewFolderName("");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const toggleFolder = (id: string) =>
    setExpandedFolders(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const startRenameChat = (chat: ChatWithFolder) => {
    setRenamingChat(chat.id);
    setRenameValue(chat.titulo);
    setOpenMenu(null);
  };

  const startRenameFolder = (folder: FolderItem) => {
    setRenamingFolder(folder.id);
    setRenameValue(folder.nome);
    setOpenMenu(null);
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const ungrouped = chats.filter(c => !c.folder_id);
  const inFolder  = (folderId: string) => chats.filter(c => c.folder_id === folderId);

  const ChatRow = ({ chat, indent = false }: { chat: ChatWithFolder; indent?: boolean }) => {
    const isActive  = pathname === `/chat/${chat.id}`;
    const meta      = TIPO_META[chat.tipo_ultimo ?? ""];
    const color     = meta?.color ?? "var(--text-3)";
    const Icon      = meta?.Icon ?? MessageSquare;
    const isRenaming = renamingChat === chat.id;
    const isMenuOpen = openMenu === chat.id;
    const isMoving   = movingChat === chat.id;

    return (
      <div className="relative group/row">
        {/* Moving overlay */}
        {isMoving && (
          <div className="absolute inset-0 z-20 rounded-lg overflow-visible">
            <div className="absolute left-full ml-1 top-0 w-44 rounded-xl overflow-hidden shadow-2xl z-30"
                 style={{ background: "var(--card)", border: "1px solid var(--border-hi)" }}>
              <p className="text-xs px-3 py-2 font-semibold" style={{ color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>
                Mover para
              </p>
              <button onClick={() => moveChatToFolder(chat.id, null)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/[0.04] text-left"
                      style={{ color: "var(--text-2)" }}>
                <MessageSquare size={11} /> Sem pasta
              </button>
              {folders.map(f => (
                <button key={f.id} onClick={() => moveChatToFolder(chat.id, f.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/[0.04] text-left"
                        style={{ color: "var(--text-2)" }}>
                  <Folder size={11} style={{ color: "var(--mint)" }} /> {f.nome}
                </button>
              ))}
              <button onClick={() => setMovingChat(null)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/[0.04] text-left"
                      style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}>
                <X size={11} /> Cancelar
              </button>
            </div>
          </div>
        )}

        <div className={cn(
          "relative flex items-center gap-2 rounded-lg text-xs transition-all duration-150 group/chat",
          indent ? "ml-3" : "",
          isActive ? "" : "hover:bg-white/[0.03]",
        )}
             style={{
               color: isActive ? "var(--text)" : "var(--text-2)",
               background: isActive ? `${color}0D` : undefined,
             }}>

          {/* Active bar */}
          <div className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-300",
            isActive ? "h-5 opacity-100" : "h-3 opacity-0 group-hover/chat:opacity-40"
          )} style={{ background: color }} />

          {isRenaming ? (
            <div className="flex items-center gap-1 flex-1 px-2 py-1.5 ml-1">
              <input
                ref={renameRef}
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmRenameChat(); if (e.key === "Escape") setRenamingChat(null); }}
                className="flex-1 text-xs rounded px-1.5 py-0.5 outline-none min-w-0"
                style={{ background: "var(--border)", color: "var(--text)", border: "1px solid var(--mint-dim)" }}
              />
              <button onClick={confirmRenameChat} className="p-0.5 rounded transition-colors hover:text-white" style={{ color: "var(--mint)" }}>
                <Check size={12} />
              </button>
              <button onClick={() => setRenamingChat(null)} className="p-0.5 rounded transition-colors hover:text-white" style={{ color: "var(--text-3)" }}>
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <Link href={`/chat/${chat.id}`} className="flex items-center gap-2 flex-1 px-2.5 py-2 ml-0.5 min-w-0">
                <Icon size={11} className="flex-shrink-0" style={{ color: isActive ? color : "var(--text-3)" }} strokeWidth={1.5} />
                <span className="truncate">{chat.titulo}</span>
              </Link>

              {/* Actions on hover */}
              <div className={cn(
                "flex items-center gap-0.5 pr-1.5 flex-shrink-0 transition-opacity duration-150",
                isMenuOpen ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
              )}>
                <button
                  onClick={e => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : chat.id); }}
                  className="p-1 rounded transition-colors hover:bg-white/10"
                  style={{ color: "var(--text-3)" }}>
                  <MoreHorizontal size={12} />
                </button>
              </div>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-0.5 w-44 rounded-xl shadow-2xl z-50 overflow-hidden"
                     style={{ background: "var(--card)", border: "1px solid var(--border-hi)" }}
                     onClick={e => e.stopPropagation()}>
                  <button onClick={() => startRenameChat(chat)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.05] text-left">
                    <Pencil size={11} style={{ color: "var(--blue)" }} />
                    <span style={{ color: "var(--text-2)" }}>Renomear</span>
                  </button>
                  <button onClick={() => { setMovingChat(chat.id); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.05] text-left">
                    <FolderPlus size={11} style={{ color: "var(--mint)" }} />
                    <span style={{ color: "var(--text-2)" }}>Mover para pasta</span>
                  </button>
                  <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }} />
                  <button onClick={() => { deleteChat(chat.id); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-red-500/10 text-left">
                    <Trash2 size={11} className="text-red-400" />
                    <span className="text-red-400">Excluir</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const FolderRow = ({ folder }: { folder: FolderItem }) => {
    const expanded     = expandedFolders.has(folder.id);
    const chatsInside  = inFolder(folder.id);
    const isRenaming   = renamingFolder === folder.id;
    const isMenuOpen   = openMenu === `folder-${folder.id}`;

    return (
      <div>
        <div className="relative group/folder flex items-center gap-1 rounded-lg transition-all duration-150 hover:bg-white/[0.03]">
          <button onClick={() => toggleFolder(folder.id)}
                  className="flex items-center gap-1.5 flex-1 px-2 py-1.5 text-xs min-w-0">
            <ChevronRight size={11} className="flex-shrink-0 transition-transform duration-200"
                         style={{ color: "var(--text-3)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }} />
            {expanded
              ? <FolderOpen size={12} style={{ color: "var(--mint)" }} className="flex-shrink-0" strokeWidth={1.5} />
              : <Folder     size={12} style={{ color: "var(--mint)" }} className="flex-shrink-0" strokeWidth={1.5} />
            }
            {isRenaming ? (
              <input
                ref={renameRef}
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmRenameFolder(); if (e.key === "Escape") setRenamingFolder(null); }}
                onClick={e => e.stopPropagation()}
                className="flex-1 text-xs rounded px-1 py-0.5 outline-none min-w-0"
                style={{ background: "var(--border)", color: "var(--text)", border: "1px solid var(--mint-dim)" }}
              />
            ) : (
              <span className="truncate font-medium text-xs" style={{ color: "var(--text-2)" }}>
                {folder.nome}
              </span>
            )}
            {!isRenaming && (
              <span className="ml-auto text-xs flex-shrink-0 mr-1" style={{ color: "var(--text-3)", fontSize: "10px" }}>
                {chatsInside.length > 0 ? chatsInside.length : ""}
              </span>
            )}
          </button>

          {/* Folder actions */}
          {!isRenaming && (
            <div className={cn(
              "flex items-center pr-1 flex-shrink-0 transition-opacity duration-150",
              isMenuOpen ? "opacity-100" : "opacity-0 group-hover/folder:opacity-100"
            )}>
              <button onClick={e => { e.stopPropagation(); setOpenMenu(isMenuOpen ? null : `folder-${folder.id}`); }}
                      className="p-1 rounded transition-colors hover:bg-white/10"
                      style={{ color: "var(--text-3)" }}>
                <MoreHorizontal size={12} />
              </button>
            </div>
          )}

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-0.5 w-40 rounded-xl shadow-2xl z-50 overflow-hidden"
                 style={{ background: "var(--card)", border: "1px solid var(--border-hi)" }}
                 onClick={e => e.stopPropagation()}>
              <button onClick={() => startRenameFolder(folder)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-white/[0.05] text-left">
                <Pencil size={11} style={{ color: "var(--blue)" }} />
                <span style={{ color: "var(--text-2)" }}>Renomear</span>
              </button>
              <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }} />
              <button onClick={() => { deleteFolder(folder.id); setOpenMenu(null); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-red-500/10 text-left">
                <Trash2 size={11} className="text-red-400" />
                <span className="text-red-400">Excluir pasta</span>
              </button>
            </div>
          )}
        </div>

        {/* Chats inside folder */}
        {expanded && (
          <div className="ml-1 border-l pl-1 mb-1" style={{ borderColor: "var(--border)" }}>
            {chatsInside.length === 0 ? (
              <p className="text-xs px-3 py-1.5" style={{ color: "var(--text-3)", fontSize: "11px" }}>Vazia</p>
            ) : (
              chatsInside.map(chat => <ChatRow key={chat.id} chat={chat} indent />)
            )}
          </div>
        )}
      </div>
    );
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

      {/* Chat + Folder list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2" onClick={() => setOpenMenu(null)}>

        {/* Folders */}
        {folders.length > 0 && (
          <div className="mb-2">
            {folders.map(folder => <FolderRow key={folder.id} folder={folder} />)}
          </div>
        )}

        {/* New folder input */}
        {creatingFolder && (
          <div className="flex items-center gap-1 px-2 py-1.5 mb-1 rounded-lg"
               style={{ background: "var(--card)", border: "1px solid var(--border-hi)" }}>
            <Folder size={11} style={{ color: "var(--mint)" }} />
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") createFolder(); if (e.key === "Escape") { setCreatingFolder(false); setNewFolderName(""); } }}
              placeholder="Nome da pasta..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: "var(--text)" }}
            />
            <button onClick={createFolder} className="p-0.5" style={{ color: "var(--mint)" }}>
              <Check size={12} />
            </button>
            <button onClick={() => { setCreatingFolder(false); setNewFolderName(""); }} style={{ color: "var(--text-3)" }}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Ungrouped chats */}
        {(chats.length > 0 || folders.length > 0) && (
          <div className="flex items-center justify-between px-2 mb-1 mt-1">
            <p style={{ color: "var(--text-3)", fontSize: "10px" }} className="font-semibold uppercase tracking-widest">
              {folders.length > 0 ? "Sem pasta" : "Recentes"}
            </p>
            <button onClick={() => { setCreatingFolder(true); setNewFolderName(""); }}
                    className="flex items-center gap-1 transition-colors hover:text-white"
                    style={{ color: "var(--text-3)", fontSize: "10px" }}
                    title="Nova pasta">
              <FolderPlus size={11} />
            </button>
          </div>
        )}

        {ungrouped.map(chat => <ChatRow key={chat.id} chat={chat} />)}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-0.5" style={{ borderTop: "1px solid var(--border)" }}>
        <Link href="/configuracoes"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
              style={{ color: "var(--text-3)" }}>
          <Settings size={13} />
          Configurações
        </Link>

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
              <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{profile.nome ?? "Estudante"}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-3)" }}>{profile.plano === "pro" ? "Pro" : "Gratuito"}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
