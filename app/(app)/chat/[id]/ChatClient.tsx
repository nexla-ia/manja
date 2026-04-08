"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "@/types/agent";

const SUGESTOES = [
  { icon: "🎯", label: "Apresentação",   text: "Apresentação sobre Inteligência Artificial com 10 slides" },
  { icon: "📄", label: "Trabalho",        text: "Trabalho sobre a Revolução Industrial (ABNT)" },
  { icon: "📋", label: "Prova",           text: "Prova de estudo sobre Direito Constitucional (10 questões)" },
  { icon: "📚", label: "Resumo",          text: "Resumo do livro 1984 de George Orwell" },
  { icon: "🗓️", label: "Plano",          text: "Plano de estudos para o ENEM em 3 meses" },
  { icon: "📜", label: "Edital",          text: "Analise o edital do concurso da Polícia Federal 2024" },
];

const ICON_COLORS: Record<string, string> = {
  "🎯": "#F59E0B", "📄": "#3B82F6", "📋": "#F43F5E",
  "📚": "#00E5A0", "🗓️": "#8B5CF6", "📜": "#F59E0B",
};

const WELCOME_MSG: ChatMessage = {
  role: "assistant",
  content: "Fala! O que você precisa hoje?",
};

interface Props {
  chatId: string;
  dbMessages: ChatMessage[];
}

export default function ChatClient({ chatId, dbMessages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput]               = useState("");
  const [planLimitado, setPlanLimitado] = useState(false);

  const initialMessages = dbMessages.length > 0 ? dbMessages : [WELCOME_MSG];

  const { messages, loading, error, sendMessage } = useChat({ chatId, initialMessages });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (error === "limite") setPlanLimitado(true);
  }, [error]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const isNew = dbMessages.length === 0;

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Header ──────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 sticky top-0 z-10"
           style={{
             borderBottom: "1px solid var(--border)",
             background: "rgba(6,6,15,0.88)",
             backdropFilter: "blur(16px)",
           }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 0 14px var(--glow-mint)" }}>
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="font-syne font-bold text-sm leading-tight">Manja Agent</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full"
                 style={{ background: "var(--mint)", boxShadow: "0 0 5px var(--mint)", animation: "pulse-glow 2s ease-in-out infinite" }} />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>Claude Sonnet 4.6 · Online</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {["🎯 Slides", "📄 Trabalho", "📋 Prova"].map((tag) => (
            <span key={tag}
                  className="hidden md:block rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Messages ────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Quick suggestions — só aparece em chats novos */}
        {isNew && messages.length === 1 && !loading && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {SUGESTOES.map((s, i) => {
              const color = ICON_COLORS[s.icon] ?? "var(--mint)";
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="group flex items-start gap-3 rounded-xl p-3.5 text-left text-xs transition-all duration-200 hover:-translate-y-0.5 anim-fade-up"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-2)",
                    animationDelay: `${i * 55}ms`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}44`;
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base transition-transform duration-200 group-hover:scale-110"
                       style={{ background: `${color}14` }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5 text-xs" style={{ color }}>{s.label}</p>
                    <p className="leading-relaxed opacity-80">{s.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="flex items-start gap-2 anim-fade-up">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}>
              <Sparkles size={11} className="text-white" />
            </div>
            <div className="rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border-hi)", borderRadius: "4px 18px 18px 18px" }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        {planLimitado && (
          <div className="rounded-2xl p-4 flex items-center gap-3 anim-fade-up"
               style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Zap size={16} style={{ color: "var(--amber)" }} className="flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--amber)" }}>
                Limite do plano gratuito atingido
              </p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Faça upgrade para gerações ilimitadas.{" "}
                <Link href="/configuracoes" className="underline hover:opacity-80" style={{ color: "var(--amber)" }}>
                  Ver planos →
                </Link>
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ───────────────────────── */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
        disabled={planLimitado}
      />
    </div>
  );
}
