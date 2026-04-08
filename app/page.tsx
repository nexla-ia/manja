import Link from "next/link";
import { Sparkles } from "lucide-react";

const FEATURES = [
  { icon: "🎯", title: "Apresentações",   desc: "Slides profissionais em segundos. Só diz o tema e a Manja monta tudo." },
  { icon: "📄", title: "Trabalhos",        desc: "Trabalhos formatados em ABNT. TCC, relatório, artigo — ela faz." },
  { icon: "📋", title: "Provas de estudo", desc: "Questões com gabarito pra você se preparar de verdade." },
  { icon: "📚", title: "Resumos",          desc: "Resume qualquer livro, artigo ou matéria de forma estruturada." },
  { icon: "🗓️", title: "Plano de estudos", desc: "Cronograma personalizado para ENEM, vestibular ou concurso." },
  { icon: "📜", title: "Editais",           desc: "Analisa edital de concurso e monta cronograma por matéria." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen relative" style={{ background: "#0A0A0F", color: "#F1F5F9" }}>
      {/* Mesh gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "-10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center animate-glow"
                 style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-syne font-bold text-xl gradient-text">Manja.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm transition hover:text-white" style={{ color: "#64748B" }}>
              Entrar
            </Link>
            <Link href="/cadastro"
                  className="btn-shimmer text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
                  style={{ boxShadow: "0 4px 15px rgba(110,231,183,0.25)" }}>
              Começar grátis
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="text-center px-4 pt-28 pb-20 max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
               style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", color: "#6EE7B7" }}>
            <Sparkles size={12} />
            Powered by Claude Sonnet 4.6
          </div>

          <h1 className="font-syne font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#F1F5F9" }}>
            Seu parceiro de estudos<br />
            com{" "}
            <span className="gradient-text">IA de verdade</span>
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#64748B" }}>
            Apresentações, trabalhos, provas de estudo, planos e análise de editais —
            tudo gerado em segundos. Para escola, faculdade e concursos.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/cadastro"
                  className="btn-shimmer text-white font-bold px-10 py-4 rounded-2xl text-base transition-all"
                  style={{ boxShadow: "0 8px 30px rgba(110,231,183,0.3)" }}>
              Começar grátis →
            </Link>
            <Link href="/login" className="text-sm transition hover:text-white" style={{ color: "#64748B" }}>
              Já tenho conta
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title}
                 className="card-gradient-border group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-slide-up"
                 style={{
                   background: "#14141E",
                   border: "1px solid #1E1E2E",
                   animationDelay: `${i * 80}ms`,
                 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                   style={{ background: "#1E1E2E" }}>
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "#F1F5F9" }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "#64748B" }}>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="max-w-3xl mx-auto px-8 py-16 text-center">
          <h2 className="font-syne font-bold text-3xl mb-3" style={{ color: "#F1F5F9" }}>
            Simples assim
          </h2>
          <p className="text-sm mb-10" style={{ color: "#64748B" }}>Sem surpresas, sem letras miúdas.</p>
          <div className="grid grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1"
                 style={{ background: "#14141E", border: "1px solid #1E1E2E" }}>
              <p className="font-bold text-xl mb-1" style={{ color: "#F1F5F9" }}>Gratuito</p>
              <p className="font-extrabold mb-6" style={{ fontSize: "2.5rem", color: "#F1F5F9" }}>R$ 0</p>
              {["5 gerações/mês", "Resumos e provas", "Download em texto", "Histórico de 5 chats"].map((item) => (
                <p key={item} className="text-sm mb-2.5 flex items-center gap-2" style={{ color: "#64748B" }}>
                  <span style={{ color: "#334155" }}>•</span> {item}
                </p>
              ))}
              <Link href="/cadastro"
                    className="mt-6 block text-center text-white rounded-xl py-3 text-sm font-semibold transition hover:border-[#6EE7B744]"
                    style={{ border: "1px solid #1E1E2E" }}>
                Começar grátis
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 text-left relative animate-glow transition-all duration-300 hover:-translate-y-1"
                 style={{ background: "linear-gradient(135deg, rgba(110,231,183,0.06), rgba(59,130,246,0.06))", border: "1px solid rgba(110,231,183,0.3)" }}>
              <div className="absolute -top-3.5 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full font-syne"
                   style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)", boxShadow: "0 4px 15px rgba(110,231,183,0.4)" }}>
                MAIS POPULAR
              </div>
              <p className="font-bold text-xl mb-1" style={{ color: "#F1F5F9" }}>Pro</p>
              <p className="font-extrabold mb-6" style={{ fontSize: "2.5rem", color: "#F1F5F9" }}>
                R$ 49<span className="text-lg font-normal" style={{ color: "#64748B" }}>/mês</span>
              </p>
              {["Gerações ilimitadas", "PPTX, DOCX e PDF reais", "Histórico completo", "Análise de editais", "Suporte prioritário"].map((item) => (
                <p key={item} className="text-sm mb-2.5 flex items-center gap-2" style={{ color: "#CBD5E1" }}>
                  <span className="gradient-text font-bold">✓</span> {item}
                </p>
              ))}
              <Link href="/cadastro"
                    className="btn-shimmer mt-6 block text-center text-white rounded-xl py-3 text-sm font-bold transition"
                    style={{ boxShadow: "0 4px 20px rgba(110,231,183,0.3)" }}>
                Assinar Pro →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm" style={{ borderTop: "1px solid #1E1E2E", color: "#334155" }}>
          © 2025 Manja.ai · Todos os direitos reservados
        </footer>
      </div>
    </main>
  );
}
