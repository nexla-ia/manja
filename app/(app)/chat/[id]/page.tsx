"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { BookOpen, Zap } from "lucide-react";
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
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1e2e20]">
        <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-600/30 flex items-center justify-center">
          <BookOpen size={15} className="text-green-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Manja Agent</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: "pulse 2s infinite" }} />
            <span className="text-gray-500 text-xs">Online · Claude Sonnet 4.6</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {["📄 Trabalho", "🎯 Slides", "📋 Prova", "📜 Edital"].map((tag) => (
            <span key={tag} className="hidden md:block bg-[#111a13] border border-[#1e2e20] rounded-full px-2.5 py-1 text-gray-500 text-xs">
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
                className="flex items-start gap-2 bg-[#111a13] border border-[#1e2e20] hover:border-green-700 rounded-xl p-3 text-left text-xs text-gray-400 hover:text-white transition group"
              >
                <span className="text-base flex-shrink-0">{s.icon}</span>
                <span className="leading-relaxed">{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-green-600/20 border border-green-600/30 flex items-center justify-center">
              <BookOpen size={13} className="text-green-400" />
            </div>
            <div className="bg-[#111a13] border border-[#1e2e20] rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Banner limite */}
        {planeLimitado && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
            <Zap size={18} className="text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-300 font-semibold text-sm">Limite do plano gratuito atingido</p>
              <p className="text-yellow-400/70 text-xs mt-0.5">
                Faça upgrade para o Pro e tenha gerações ilimitadas.{" "}
                <Link href="/configuracoes" className="underline hover:text-yellow-300">
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
