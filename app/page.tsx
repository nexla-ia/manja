import Link from "next/link";
import { Sparkles, ArrowRight, Zap, FileText, Brain, Calendar, BookOpen, Award } from "lucide-react";

const FEATURES = [
  { icon: <Zap size={22} />,       color: "#F59E0B", label: "Apresentações",    desc: "Slides profissionais prontos em segundos, do tema ao design." },
  { icon: <FileText size={22} />,  color: "#3B82F6", label: "Trabalhos",         desc: "ABNT automático — TCC, relatório, artigo sem sofrimento." },
  { icon: <Brain size={22} />,     color: "#00E5A0", label: "Provas de estudo",  desc: "Questões com gabarito pra você se preparar de verdade." },
  { icon: <BookOpen size={22} />,  color: "#F43F5E", label: "Resumos",           desc: "Qualquer livro, artigo ou matéria destrinchado e organizado." },
  { icon: <Calendar size={22} />,  color: "#8B5CF6", label: "Plano de estudos", desc: "Cronograma real para ENEM, vestibular ou concurso público." },
  { icon: <Award size={22} />,     color: "#F59E0B", label: "Análise de Edital","desc": "Decifra edital de concurso e monta o cronograma por matéria." },
];

const STATS = [
  { n: "50k+",  label: "estudantes" },
  { n: "2M+",   label: "materiais gerados" },
  { n: "98%",   label: "aprovação" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen grain" style={{ background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>

      {/* ── Ambient light ────────────────── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0">
        <div className="blob" style={{ width: 700, height: 700, top: "-15%", left: "-15%",  background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 65%)" }} />
        <div className="blob" style={{ width: 600, height: 600, top: "25%",  right: "-15%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)" }} />
        <div className="blob" style={{ width: 400, height: 400, bottom: "5%", left: "35%",  background: "radial-gradient(circle, rgba(244,63,94,0.05) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10">

        {/* ── Nav ──────────────────────────── */}
        <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 0 20px var(--glow-mint)" }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-syne font-bold text-xl grad-text">Manja.ai</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-2)" }}>
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#pricing"  className="hover:text-white transition-colors">Preços</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-5 py-2 rounded-xl">Entrar</Link>
            <Link href="/cadastro" className="btn-primary text-sm px-5 py-2.5 rounded-xl">Começar grátis</Link>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────── */}
        <section className="max-w-7xl mx-auto px-8 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="anim-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
                 style={{ background: "rgba(0,229,160,0.07)", border: "1px solid rgba(0,229,160,0.2)", color: "var(--mint)" }}>
              <Sparkles size={11} />
              Claude Sonnet 4.6 · Gratuito para começar
            </div>

            <h1 className="font-syne font-extrabold leading-[1.05] mb-6"
                style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", letterSpacing: "-0.02em" }}>
              Seu copiloto<br />
              de estudos<br />
              <span className="grad-text-full">com IA real.</span>
            </h1>

            <p className="mb-10 max-w-md text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
              Apresentações, trabalhos ABNT, provas com gabarito, resumos, planos de estudo e análise de editais — tudo em segundos.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/cadastro" className="btn-primary px-8 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold">
                Começar grátis
                <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
                Já tenho conta →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-syne font-bold text-2xl grad-text">{s.n}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — abstract visual */}
          <div className="hidden lg:flex items-center justify-center relative anim-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Rotating ring */}
            <div className="absolute w-72 h-72 rounded-full anim-spin-slow"
                 style={{ border: "1px dashed rgba(0,229,160,0.15)" }} />
            <div className="absolute w-96 h-96 rounded-full"
                 style={{ border: "1px dashed rgba(59,130,246,0.1)", animation: "spin-slow 30s linear infinite reverse" }} />

            {/* Center card */}
            <div className="relative z-10 rounded-3xl p-6 w-72"
                 style={{ background: "var(--card)", border: "1px solid var(--border-hi)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))", boxShadow: "0 4px 14px var(--glow-mint)" }}>
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Manja Agent</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--mint)", boxShadow: "0 0 6px var(--mint)" }} />
                    <span className="text-xs" style={{ color: "var(--text-2)" }}>Online agora</span>
                  </div>
                </div>
              </div>

              {/* Mock messages */}
              <div className="space-y-3 mb-4">
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs leading-relaxed"
                     style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                  Preciso de slides sobre machine learning pra aula amanhã!
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs leading-relaxed text-white"
                     style={{ background: "linear-gradient(135deg, var(--mint-dim), var(--blue))" }}>
                  Claro! Gerando sua apresentação com 12 slides agora... ✨
                </div>
              </div>

              {/* Mock progress */}
              <div className="rounded-xl p-3" style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "var(--mint)" }}>🎯 Machine Learning.pptx</span>
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>100%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, var(--mint-dim), var(--blue))" }} />
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 rounded-2xl px-3 py-2 text-xs font-semibold anim-float"
                 style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "var(--amber)", animationDelay: "0s" }}>
              ⚡ 2s de geração
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl px-3 py-2 text-xs font-semibold anim-float"
                 style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA", animationDelay: "1.5s" }}>
              📄 ABNT automático
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────── */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--mint)" }}>
              Funcionalidades
            </p>
            <h2 className="font-syne font-bold mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
              Tudo que você precisa.<br />
              <span className="grad-text">Num só lugar.</span>
            </h2>
            <p className="max-w-md mx-auto text-sm" style={{ color: "var(--text-2)" }}>
              Do ENEM à pós-graduação. A Manja domina todos os formatos que a sua vida acadêmica exige.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="card-glow rounded-2xl p-6 anim-fade-up"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  animationDelay: `${i * 70}ms`,
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                     style={{ background: `${f.color}14`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-syne font-bold text-base mb-2">{f.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ──────────────────────── */}
        <section id="pricing" className="max-w-5xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--mint)" }}>Preços</p>
            <h2 className="font-syne font-bold mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}>
              Simples assim.
            </h2>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Sem surpresas. Sem letras miúdas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-3xl p-8 flex flex-col"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="font-syne font-bold text-xl mb-1">Gratuito</p>
              <div className="mb-8 flex items-end gap-1">
                <span className="font-syne font-extrabold text-5xl" style={{ letterSpacing: "-0.03em" }}>R$ 0</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["5 gerações por mês", "Resumos e provas de estudo", "Histórico de 5 chats"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-2)" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--border-hi)" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro" className="btn-ghost py-3 rounded-2xl text-center text-sm font-semibold">
                Começar grátis
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl p-8 flex flex-col relative overflow-hidden"
                 style={{
                   background: "linear-gradient(135deg, rgba(0,200,125,0.07), rgba(59,130,246,0.07))",
                   border: "1px solid rgba(0,229,160,0.25)",
                   boxShadow: "0 0 40px rgba(0,229,160,0.08), 0 0 80px rgba(59,130,246,0.04)",
                 }}>
              {/* Shimmer corner */}
              <div className="absolute -top-px left-6 right-6 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, var(--mint), transparent)" }} />

              <div className="flex items-center justify-between mb-1">
                <p className="font-syne font-bold text-xl">Pro</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--mint-dim), var(--blue))", color: "#fff" }}>
                  POPULAR
                </span>
              </div>
              <div className="mb-8 flex items-end gap-1">
                <span className="font-syne font-extrabold text-5xl" style={{ letterSpacing: "-0.03em" }}>R$ 49</span>
                <span className="mb-2 text-sm" style={{ color: "var(--text-2)" }}>/mês</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Gerações ilimitadas",
                  "PPTX, DOCX e PDF reais",
                  "Histórico completo",
                  "Análise de editais completa",
                  "Suporte prioritário",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <span className="font-bold grad-text text-base leading-none">✓</span>
                    <span style={{ color: "var(--text)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/cadastro" className="btn-primary py-3.5 rounded-2xl text-center text-sm font-bold">
                Assinar Pro →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA final ────────────────────── */}
        <section className="max-w-7xl mx-auto px-8 py-16">
          <div className="rounded-3xl p-12 text-center relative overflow-hidden"
               style={{
                 background: "linear-gradient(135deg, rgba(0,200,125,0.08), rgba(59,130,246,0.08), rgba(244,63,94,0.05))",
                 border: "1px solid rgba(0,229,160,0.15)",
               }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="blob" style={{ width: 300, height: 300, top: "-20%", left: "-5%",  background: "radial-gradient(circle, rgba(0,229,160,0.1), transparent 70%)" }} />
              <div className="blob" style={{ width: 300, height: 300, bottom: "-20%", right: "-5%", background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)" }} />
            </div>
            <div className="relative">
              <p className="font-syne font-extrabold mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.02em" }}>
                Chega de enrolação.<br />
                <span className="grad-text">Começa agora.</span>
              </p>
              <p className="mb-8 max-w-sm mx-auto text-sm" style={{ color: "var(--text-2)" }}>
                Cria sua conta em 30 segundos. Sem cartão de crédito.
              </p>
              <Link href="/cadastro" className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold">
                Criar conta grátis <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────── */}
        <footer className="py-8 px-8 flex items-center justify-between max-w-7xl mx-auto text-xs"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}>
          <span className="font-syne font-bold grad-text text-sm">Manja.ai</span>
          <span>© 2025 · Todos os direitos reservados</span>
        </footer>
      </div>
    </main>
  );
}
