export const PLANS = {
  free: {
    name: "Gratuito",
    price: 0,
    geracoes: 5,
    tokens_mes: 100_000,
    mensagens_mes: 30,
    tipos: ["resumo", "prova"],
    features: [
      "5 arquivos gerados por mês",
      "30 mensagens por mês",
      "Resumos e provas",
      "Download em DOCX e PDF",
      "Histórico de 5 chats",
    ],
  },
  pro: {
    name: "Pro",
    price: 4900,
    geracoes: Infinity,
    tokens_mes: Infinity,
    mensagens_mes: Infinity,
    tipos: ["apresentacao", "trabalho", "prova", "resumo", "plano", "edital"],
    features: [
      "Arquivos ilimitados",
      "Mensagens ilimitadas",
      "Todos os tipos (PPTX, DOCX, PDF)",
      "Histórico completo",
      "Análise de editais de concurso",
      "Suporte prioritário",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
  },
} as const;

export type PlanName = keyof typeof PLANS;

export function canGenerate(plano: string, tipo: string): boolean {
  const plan = PLANS[plano as PlanName];
  if (!plan) return false;
  return (plan.tipos as readonly string[]).includes(tipo);
}

export function getRemainingGenerations(plano: string, geracoesMes: number): number {
  const plan = PLANS[plano as PlanName];
  if (!plan) return 0;
  if (plan.geracoes === Infinity) return Infinity;
  return Math.max(0, plan.geracoes - geracoesMes);
}

export function getRemainingMessages(plano: string, mensagensMes: number): number {
  const plan = PLANS[plano as PlanName];
  if (!plan) return 0;
  if (plan.mensagens_mes === Infinity) return Infinity;
  return Math.max(0, plan.mensagens_mes - mensagensMes);
}

/** Formata tokens para exibição: 1500 → "1.5k", 120000 → "120k" */
export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

/** Custo estimado em centavos (Sonnet 4.6: input R$0,015/1k, output R$0,075/1k) */
export function estimarCustoReais(tokens: number): string {
  const reais = (tokens / 1000) * 0.04; // média ponderada input/output
  if (reais < 0.01) return "< R$ 0,01";
  return `R$ ${reais.toFixed(2).replace(".", ",")}`;
}
