export type Plano = "free" | "pro" | "admin";
export type MessageRole = "user" | "assistant";
export type ArquivoTipo = "pptx" | "docx" | "pdf";
export type AgenteTipo = "apresentacao" | "trabalho" | "prova" | "resumo" | "plano" | "edital";

export interface Profile {
  id: string;
  nome: string | null;
  plano: Plano;
  geracoes_mes: number;
  geracoes_reset_em: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  xp_total: number;
  nivel: number;
  streak_dias: number;
  ultimo_acesso: string | null;
  criado_em: string;
}

export interface Chat {
  id: string;
  user_id: string;
  titulo: string;
  tipo_ultimo: AgenteTipo | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  arquivo_url: string | null;
  arquivo_tipo: ArquivoTipo | null;
  criado_em: string;
}

export interface File {
  id: string;
  user_id: string;
  chat_id: string | null;
  titulo: string | null;
  tipo: AgenteTipo;
  url: string;
  tamanho_bytes: number | null;
  criado_em: string;
}

export interface XpEvent {
  id: string;
  user_id: string;
  pontos: number;
  motivo: string;
  criado_em: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  tipo: string;
  desbloqueado_em: string;
}
