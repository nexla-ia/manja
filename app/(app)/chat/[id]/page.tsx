import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";
import { ChatMessage } from "@/types/agent";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const chatId = params.id;

  // Verifica se o chat pertence ao usuário
  const { data: chat } = await supabase
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .eq("user_id", user.id)
    .single();

  if (!chat) redirect("/dashboard");

  // Busca mensagens salvas
  const { data: rows } = await supabase
    .from("messages")
    .select("role, content, arquivo_tipo")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  const dbMessages: ChatMessage[] = (rows ?? []).map((r) => ({
    role: r.role as "user" | "assistant",
    content: r.content,
    fileResult: null, // conteúdo completo não é re-hidratado; FilePreview re-gera se necessário
  }));

  return <ChatClient chatId={chatId} dbMessages={dbMessages} />;
}
