"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const SUGESTOES = [
  { icon: "🎯", text: "Apresentação sobre Inteligência Artificial com 10 slides" },
  { icon: "📄", text: "Trabalho sobre a Revolução Industrial (ABNT)" },
  { icon: "📋", text: "Prova de estudo sobre Direito Constitucional (10 questões)" },
  { icon: "📚", text: "Resumo do livro 1984 de George Orwell" },
  { icon: "🗓️", text: "Plano de estudos para o ENEM em 3 meses" },
  { icon: "📜", text: "Analise o edital do concurso da Polícia Federal 2024" },
];

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const chatId = params.id;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [planeLimitado, setPlaneLimitado] = useState(false);
  const supabase = createClient();

  const { messages, loading, error, sendMessage } = useChat({
    chatId,
    initialMessages: [
      {
        role: "assistant",
        content: "Fala! 👋 Sou o **Manja**, seu parceiro de estudos com IA.\n\nPosso criar apresentações, trabalhos, provas, resumos, planos de estudo e analisar editais de concurso. O que você precisa hoje?",
      },
    ],
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (error === "limite") setPlaneLimitado(true);
  }, [error]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleSugestao = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 sticky top-0 z-10"
           style={{
             borderBottom: "1px solid #1E1E2E",
             background: "rgba(10,10,15,0.8)",
             backdropFilter: "blur(12px)",
           }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)", boxShadow: "0 4px 15px rgba(110,231,183,0.25)" }}>
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm font-syne" style={{ color: "#F1F5F9" }}>Manja Agent</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#6EE7B7", animation: "pulse 2s infinite" }} />
            <span className="text-xs" style={{ color: "#64748B" }}>Online · Claude Sonnet 4.6</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {["📄 Trabalho", "🎯 Slides", "📋 Prova", "📜 Edital"].map((tag) => (
            <span key={tag} className="hidden md:block rounded-full px-2.5 py-1 text-xs"
                  style={{ background: "#14141E", border: "1px solid #1E1E2E", color: "#64748B" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Sugestões (só na primeira mensagem) */}
        {messages.length === 1 && !loading && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {SUGESTOES.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSugestao(s.text)}
                className="card-gradient-border flex items-start gap-3 rounded-xl p-3.5 text-left text-xs transition-all group animate-slide-up"
                style={{
                  background: "#14141E",
                  border: "1px solid #1E1E2E",
                  color: "#64748B",
                  animationDelay: `${i * 60}ms`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#F1F5F9";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#64748B";
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <span className="leading-relaxed pt-0.5">{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 animate-slide-up">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
              <Sparkles size={13} className="text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm" style={{ background: "#14141E", border: "1px solid #1E1E2E" }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Banner limite */}
        {planeLimitado && (
          <div className="rounded-xl p-4 flex items-center gap-3 animate-slide-up"
               style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <Zap size={18} style={{ color: "#F59E0B" }} className="flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#FCD34D" }}>Limite do plano gratuito atingido</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(252,211,77,0.7)" }}>
                Faça upgrade para o Pro e tenha gerações ilimitadas.{" "}
                <Link href="/configuracoes" className="underline hover:opacity-80">
                  Ver planos →
                </Link>
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        loading={loading}
        disabled={planeLimitado}
      />
    </div>
  );
}
