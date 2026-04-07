import { AgenteTipo } from "./database";

export interface SlideContent {
  titulo: string;
  corpo: string[];
  notas?: string;
  layout?: "default" | "cover" | "two-col" | "image";
}

export interface SecaoContent {
  titulo: string;
  texto: string;
}

export interface QuestaoContent {
  numero: number;
  enunciado: string;
  alternativas?: string[];
  resposta: string;
  explicacao?: string;
}

export interface DiaContent {
  dia: string;
  topicos: string[];
  duracao: string;
  materia?: string;
}

export interface EditalContent {
  cargo: string;
  banca: string;
  materias: { nome: string; peso: number; topicos: string[] }[];
  cronograma: DiaContent[];
}

export type AgenteConteudo =
  | { slides: SlideContent[] }
  | { secoes: SecaoContent[] }
  | { questoes: QuestaoContent[] }
  | { dias: DiaContent[] }
  | EditalContent;

export interface AgenteResponse {
  tipo: AgenteTipo;
  titulo: string;
  subtitulo?: string;
  conteudo: AgenteConteudo;
  mensagem: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  fileResult?: AgenteResponse | null;
  arquivoUrl?: string | null;
  criado_em?: string;
}
