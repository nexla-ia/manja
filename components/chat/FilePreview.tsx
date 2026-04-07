"use client";

import { useState } from "react";
import { AgenteResponse } from "@/types/agent";
import { Download, Loader2 } from "lucide-react";

const TIPO_CONFIG: Record<string, { icon: string; label: string; ext: string }> = {
  apresentacao: { icon: "🎯", label: "Apresentação PowerPoint", ext: "pptx" },
  trabalho:     { icon: "📄", label: "Trabalho Acadêmico",      ext: "docx" },
  prova:        { icon: "📋", label: "Prova de Estudo",         ext: "pdf"  },
  resumo:       { icon: "📚", label: "Resumo",                  ext: "docx" },
  plano:        { icon: "🗓️", label: "Plano de Estudos",        ext: "pdf"  },
  edital:       { icon: "📜", label: "Análise de Edital",       ext: "pdf"  },
};

interface FilePreviewProps {
  result: AgenteResponse;
  arquivoUrl?: string | null;
}

export function FilePreview({ result, arquivoUrl }: FilePreviewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = TIPO_CONFIG[result.tipo] ?? { icon: "📎", label: result.tipo, ext: "txt" };
  const c = result.conteudo as Record<string, unknown>;
  const slides   = "slides"   in c && Array.isArray(c.slides)   ? c.slides   : null;
  const questoes = "questoes" in c && Array.isArray(c.questoes) ? c.questoes : null;
  const secoes   = "secoes"   in c && Array.isArray(c.secoes)   ? c.secoes   : null;
  const dias     = "dias"     in c && Array.isArray(c.dias)     ? c.dias     : null;

  const handleDownload = async () => {
    if (arquivoUrl) { window.open(arquivoUrl, "_blank"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: result.tipo, titulo: result.titulo, subtitulo: result.subtitulo, conteudo: result.conteudo }),
      });
      if (res.status === 402) { setError("Disponível apenas no plano Pro."); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Erro ao gerar"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40)}.${config.ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 bg-[#0d1410] border border-[#1e2e20] rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-600/30 flex items-center justify-center text-xl">{config.icon}</div>
        <div>
          <p className="text-white font-semibold text-sm">{result.titulo}</p>
          <p className="text-green-500 text-xs">{config.label} · .{config.ext.toUpperCase()}</p>
        </div>
      </div>
      {slides && <div className="mb-3 flex flex-wrap gap-1.5">{slides.slice(0,4).map((s: {titulo:string}, i:number) => (<span key={i} className="bg-green-600/10 text-gray-400 text-xs rounded-lg px-2 py-1 truncate max-w-[150px]">{i+1}. {s.titulo}</span>))}{slides.length > 4 && <span className="bg-[#111a13] text-gray-500 text-xs rounded-lg px-2 py-1">+{slides.length-4} slides</span>}</div>}
      {questoes && <p className="text-gray-500 text-xs mb-3">{questoes.length} questões com gabarito</p>}
      {secoes && <p className="text-gray-500 text-xs mb-3">{secoes.length} seções · formatação ABNT</p>}
      {dias && <p className="text-gray-500 text-xs mb-3">{dias.length} dias de estudo</p>}
      {error && <div className="mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">{error}{error.includes("Pro") && <a href="/configuracoes" className="ml-1 underline">Ver planos →</a>}</div>}
      <button onClick={handleDownload} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-semibold transition">
        {loading ? <><Loader2 size={15} className="animate-spin" /> Gerando arquivo...</> : <><Download size={15} /> Baixar {config.label}</>}
      </button>
    </div>
  );
}
