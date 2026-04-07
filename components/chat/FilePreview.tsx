"use client";

import { AgenteResponse } from "@/types/agent";
import { Download } from "lucide-react";

const TIPO_CONFIG: Record<string, { icon: string; label: string; ext: string }> = {
  apresentacao: { icon: "🎯", label: "Apresentação PowerPoint", ext: "txt" },
  trabalho:     { icon: "📄", label: "Trabalho Acadêmico",     ext: "txt" },
  prova:        { icon: "📋", label: "Prova de Estudo",        ext: "txt" },
  resumo:       { icon: "📚", label: "Resumo",                 ext: "txt" },
  plano:        { icon: "🗓️", label: "Plano de Estudos",       ext: "txt" },
  edital:       { icon: "📜", label: "Análise de Edital",      ext: "txt" },
};

function generateTextContent(result: AgenteResponse): string {
  const lines: string[] = [];
  const title = result.titulo.toUpperCase();
  lines.push(title, "=".repeat(title.length), "");
  if (result.subtitulo) lines.push(result.subtitulo, "");

  const c = result.conteudo as Record<string, unknown>;

  if ("slides" in c && Array.isArray(c.slides)) {
    c.slides.forEach((s: { titulo: string; corpo?: string[]; notas?: string }, i: number) => {
      lines.push(`--- SLIDE ${i + 1}: ${s.titulo} ---`);
      s.corpo?.forEach((b) => lines.push(`• ${b}`));
      if (s.notas) lines.push(`\n[Notas: ${s.notas}]`);
      lines.push("");
    });
  } else if ("secoes" in c && Array.isArray(c.secoes)) {
    c.secoes.forEach((s: { titulo: string; texto: string }) => {
      lines.push(`## ${s.titulo}`, "", s.texto, "", "");
    });
  } else if ("questoes" in c && Array.isArray(c.questoes)) {
    c.questoes.forEach((q: { numero: number; enunciado: string; alternativas?: string[]; resposta: string }) => {
      lines.push(`${q.numero}. ${q.enunciado}`);
      q.alternativas?.forEach((a) => lines.push(`   ${a}`));
      lines.push("");
    });
    lines.push("--- GABARITO ---");
    c.questoes.forEach((q: { numero: number; resposta: string }) => {
      lines.push(`${q.numero}. ${q.resposta}`);
    });
  } else if ("dias" in c && Array.isArray(c.dias)) {
    c.dias.forEach((d: { dia: string; duracao: string; topicos: string[] }) => {
      lines.push(`📅 ${d.dia} (${d.duracao})`);
      d.topicos.forEach((t) => lines.push(`  ✓ ${t}`));
      lines.push("");
    });
  }

  return lines.join("\n");
}

interface FilePreviewProps {
  result: AgenteResponse;
  arquivoUrl?: string | null;
}

export function FilePreview({ result, arquivoUrl }: FilePreviewProps) {
  const config = TIPO_CONFIG[result.tipo] ?? { icon: "📎", label: result.tipo, ext: "txt" };

  const handleDownload = () => {
    if (arquivoUrl) {
      window.open(arquivoUrl, "_blank");
      return;
    }
    const content = generateTextContent(result);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = result.titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);
    a.download = `${slug}.${config.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const c = result.conteudo as Record<string, unknown>;
  const slides = "slides" in c && Array.isArray(c.slides) ? c.slides : null;
  const questoes = "questoes" in c && Array.isArray(c.questoes) ? c.questoes : null;

  return (
    <div className="mt-3 bg-[#0d1410] border border-[#1e2e20] rounded-xl p-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-600/30 flex items-center justify-center text-xl">
          {config.icon}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{result.titulo}</p>
          <p className="text-green-500 text-xs">{config.label} • Pronto para baixar</p>
        </div>
      </div>

      {slides && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {slides.slice(0, 4).map((s: { titulo: string }, i: number) => (
            <span key={i} className="bg-green-600/10 text-gray-400 text-xs rounded-lg px-2 py-1 max-w-[140px] truncate">
              {i + 1}. {s.titulo}
            </span>
          ))}
          {slides.length > 4 && (
            <span className="bg-[#111a13] text-gray-500 text-xs rounded-lg px-2 py-1">
              +{slides.length - 4} slides
            </span>
          )}
        </div>
      )}

      {questoes && (
        <p className="text-gray-500 text-xs mb-3">{questoes.length} questões com gabarito incluído</p>
      )}

      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white rounded-xl py-2.5 text-sm font-semibold transition"
      >
        <Download size={15} />
        Baixar {config.label}
      </button>
    </div>
  );
}
