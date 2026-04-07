import { AgenteResponse } from "@/types/agent";

export function parseAgenteResponse(text: string): AgenteResponse | null {
  // Tenta extrair JSON do bloco de código
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]) as AgenteResponse;
    } catch {}
  }

  // Tenta JSON direto no texto
  const rawMatch = text.match(/\{[\s\S]*"tipo"[\s\S]*"conteudo"[\s\S]*\}/);
  if (rawMatch) {
    try {
      return JSON.parse(rawMatch[0]) as AgenteResponse;
    } catch {}
  }

  return null;
}

export function extractMessage(text: string, parsed: AgenteResponse | null): string {
  if (parsed?.mensagem) return parsed.mensagem;

  // Remove o bloco JSON do texto para retornar só a mensagem
  const clean = text
    .replace(/```json[\s\S]*?```/g, "")
    .replace(/\{[\s\S]*"tipo"[\s\S]*\}/g, "")
    .trim();

  return clean || "Seu material está pronto! 🎉";
}
