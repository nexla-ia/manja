export const PLANS = {
  free: {
    name: "Gratuito",
    price: 0,
    geracoes: 5,
    tipos: ["resumo", "prova"],
    features: [
      "5 gerações por mês",
      "Resumos e provas",
      "Download em texto",
      "Histórico de 5 chats",
    ],
  },
  pro: {
    name: "Pro",
    price: 4900, // em centavos
    geracoes: Infinity,
    tipos: ["apresentacao", "trabalho", "prova", "resumo", "plano", "edital"],
    features: [
      "Gerações ilimitadas",
      "Todos os tipos (PPTX, DOCX, PDF)",
      "Histórico completo",
      "Agente com memória de contexto",
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
