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

  // Busca mensagens salvas — ordena por id (sempre existe) como fallback seguro
  const { data: rows, error: msgError } = await supabase
    .from("messages")
    .select("id, role, content, arquivo_tipo")
    .eq("chat_id", chatId)
    .order("id", { ascending: true });

  if (msgError) {
    console.error("[ChatPage] erro ao carregar mensagens:", msgError.message);
  }

  const dbMessages: ChatMessage[] = (rows ?? []).map((r) => ({
    role: r.role as "user" | "assistant",
    content: r.content,
    fileResult: null,
  }));

  return <ChatClient chatId={chatId} dbMessages={dbMessages} />;
}
