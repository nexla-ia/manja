import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex grain" style={{ background: "var(--bg)" }}>

      {/* ── Brand panel ─────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
           style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

        {/* Ambient blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="blob" style={{ width: 500, height: 500, top: "-20%", left: "-20%",  background: "radial-gradient(circle, rgba(0,229,160,0.1), transparent 60%)" }} />
          <div className="blob" style={{ width: 400, height: 400, bottom: "-10%", right: "-15%", background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 60%)" }} />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 0 20px var(--glow-mint)" }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-syne font-bold text-2xl grad-text">Manja.ai</span>
          </Link>
        </div>

        {/* Center: Headline */}
        <div className="relative z-10">
          <h2 className="font-syne font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 3vw, 3rem)", letterSpacing: "-0.02em" }}>
            Seu copiloto<br />
            de estudos<br />
            <span className="grad-text">com IA.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-2)" }}>
            Apresentações, trabalhos, provas, resumos e planos de estudo — gerados em segundos com Claude AI.
          </p>

          {/* Testimonial */}
          <div className="mt-10 rounded-2xl p-5"
               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-hi)" }}>
            <p className="text-sm italic mb-3" style={{ color: "var(--text-2)" }}>
              &ldquo;Passei no concurso do INSS depois de montar meu plano de estudos com a Manja. Salvou minha vida.&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                   style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}>
                C
              </div>
              <div>
                <p className="text-xs font-semibold">Carolina M.</p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>Técnica do INSS · Brasília</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 flex items-center gap-8">
          {[["50k+", "estudantes"], ["2M+", "materiais"], ["98%", "aprovação"]].map(([n, l]) => (
            <div key={l}>
              <p className="font-syne font-bold text-xl grad-text">{n}</p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form panel ──────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-syne font-bold text-xl grad-text">Manja.ai</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
