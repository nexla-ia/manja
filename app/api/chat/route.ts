import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { MANJA_SYSTEM_PROMPT, TITLE_PROMPT } from "@/lib/anthropic/prompts";
import { parseAgenteResponse, extractMessage } from "@/lib/anthropic/parser";
import { canGenerate, getRemainingGenerations } from "@/lib/stripe/plans";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca perfil
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    const { chatId, messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 });
    }

    // Verifica limite do plano free
    const remaining = getRemainingGenerations(profile.plano, profile.geracoes_mes);
    if (remaining === 0) {
      return NextResponse.json(
        { error: "Limite de gerações atingido. Faça upgrade para o plano Pro." },
        { status: 402 }
      );
    }

    // Chama a API do Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: MANJA_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const fileResult = parseAgenteResponse(rawText);
    const message = extractMessage(rawText, fileResult);

    // Salva mensagens no banco
    if (chatId) {
      // Salva mensagem do usuário
      const lastUserMsg = messages[messages.length - 1];
      await supabase.from("messages").insert({
        chat_id: chatId,
        role: "user",
        content: lastUserMsg.content,
      });

      // Salva resposta do agente
      await supabase.from("messages").insert({
        chat_id: chatId,
        role: "assistant",
        content: message,
        arquivo_tipo: fileResult?.tipo as string ?? null,
      });

      // Atualiza título do chat se for a primeira mensagem do usuário
      const userMessages = messages.filter((m: { role: string }) => m.role === "user");
      if (userMessages.length === 1) {
        const titleRes = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 20,
          system: TITLE_PROMPT,
          messages: [{ role: "user", content: lastUserMsg.content }],
        });
        const title = titleRes.content
          .filter((b) => b.type === "text")
          .map((b) => (b as { type: "text"; text: string }).text)
          .join("")
          .trim();

        await supabase
          .from("chats")
          .update({ titulo: title, tipo_ultimo: fileResult?.tipo ?? null, atualizado_em: new Date().toISOString() })
          .eq("id", chatId);
      } else {
        await supabase
          .from("chats")
          .update({ tipo_ultimo: fileResult?.tipo ?? null, atualizado_em: new Date().toISOString() })
          .eq("id", chatId);
      }

      // Incrementa tokens e gerações
      const tokensUsados = (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0);
      const updates: Record<string, number> = {
        tokens_mes: (profile.tokens_mes ?? 0) + tokensUsados,
        mensagens_mes: (profile.mensagens_mes ?? 0) + 1,
      };
      if (fileResult) {
        updates.geracoes_mes = (profile.geracoes_mes ?? 0) + 1;
      }
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }

    return NextResponse.json({ message, fileResult });
  } catch (error) {
    console.error("[/api/chat] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
