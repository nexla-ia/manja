import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0b] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1e2e20]">
        <span className="text-xl font-bold">
          <span className="text-green-500">Manja</span>.ai
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition">
            Entrar
          </Link>
          <Link href="/cadastro" className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-4 pt-24 pb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-600/20 rounded-full px-4 py-1.5 text-green-400 text-xs font-semibold mb-8">
          ✨ Powered by Claude Sonnet 4.6
        </div>
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Seu parceiro de estudos<br />
          <span className="text-green-500">com IA</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Apresentações, trabalhos, provas de estudo, planos e análise de editais —
          tudo gerado em segundos por IA. Para escola, faculdade e concursos.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/cadastro" className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-2xl text-base transition">
            Começar grátis →
          </Link>
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition">
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16 grid grid-cols-3 gap-6">
        {[
          { icon: "🎯", title: "Apresentações",  desc: "Slides profissionais em segundos. Só diz o tema e a Manja monta tudo." },
          { icon: "📄", title: "Trabalhos",       desc: "Trabalhos formatados em ABNT. TCC, relatório, artigo — ela faz." },
          { icon: "📋", title: "Provas de estudo", desc: "Questões com gabarito pra você se preparar de verdade." },
          { icon: "📚", title: "Resumos",          desc: "Resume qualquer livro, artigo ou matéria de forma estruturada." },
          { icon: "🗓️", title: "Plano de estudos", desc: "Cronograma personalizado para ENEM, vestibular ou concurso." },
          { icon: "📜", title: "Editais",           desc: "Analisa edital de concurso e monta cronograma por matéria." },
        ].map((f) => (
          <div key={f.title} className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Simples assim</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-8 text-left">
            <p className="text-white font-bold text-xl mb-1">Gratuito</p>
            <p className="text-4xl font-extrabold text-white mb-6">R$ 0</p>
            {["5 gerações/mês", "Resumos e provas", "Download em texto", "Histórico de 5 chats"].map((f) => (
              <p key={f} className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-gray-600">•</span> {f}
              </p>
            ))}
            <Link href="/cadastro" className="mt-6 block text-center border border-[#1e2e20] hover:border-green-700 text-white rounded-xl py-3 text-sm font-semibold transition">
              Começar grátis
            </Link>
          </div>

          <div className="bg-green-600/5 border border-green-600/40 rounded-2xl p-8 text-left relative">
            <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              MAIS POPULAR
            </div>
            <p className="text-white font-bold text-xl mb-1">Pro</p>
            <p className="text-4xl font-extrabold text-white mb-6">R$ 49<span className="text-lg font-normal text-gray-400">/mês</span></p>
            {["Gerações ilimitadas", "PPTX, DOCX e PDF reais", "Histórico completo", "Análise de editais", "Suporte prioritário"].map((f) => (
              <p key={f} className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                <span className="text-green-500">✓</span> {f}
              </p>
            ))}
            <Link href="/cadastro" className="mt-6 block text-center bg-green-600 hover:bg-green-500 text-white rounded-xl py-3 text-sm font-bold transition">
              Assinar Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2e20] py-8 text-center text-gray-600 text-sm">
        © 2025 Manja.ai · Todos os direitos reservados
      </footer>
    </main>
  );
}
