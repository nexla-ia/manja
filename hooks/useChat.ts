"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/types/agent";

interface UseChatOptions {
  chatId: string;
  initialMessages?: ChatMessage[];
}

export function useChat({ chatId, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, messages: history }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 402) {
          setError("limite");
        } else {
          throw new Error(data.error || "Erro ao enviar mensagem");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          fileResult: data.fileResult || null,
          arquivoUrl: data.arquivoUrl || null,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [chatId, messages, loading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
