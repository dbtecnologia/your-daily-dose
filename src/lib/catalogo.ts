import type { Database } from "@/integrations/supabase/types";

export type Veiculo = Database["public"]["Tables"]["veiculos"]["Row"];
export type VeiculoInsert = Database["public"]["Tables"]["veiculos"]["Insert"];
export type VeiculoFoto = Database["public"]["Tables"]["veiculo_fotos"]["Row"];
export type Configuracoes = Database["public"]["Tables"]["configuracoes"]["Row"];

export type VeiculoComFotos = Veiculo & { veiculo_fotos: VeiculoFoto[] };

export const COMBUSTIVEIS = [
  "Flex",
  "Gasolina",
  "Etanol",
  "Diesel",
  "Híbrido",
  "Elétrico",
  "GNV",
] as const;

export const CAMBIOS = ["Manual", "Automático", "Automatizado", "CVT"] as const;

export const CARROCERIAS = [
  "Hatch",
  "Sedã",
  "SUV",
  "Picape",
  "Minivan",
  "Utilitário",
  "Cupê",
  "Conversível",
] as const;

export const STATUS_VEICULO = ["disponivel", "reservado", "vendido"] as const;

export const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  novo: "Novo",
  em_atendimento: "Em atendimento",
  em_analise: "Em análise",
  proposta_enviada: "Proposta enviada",
  aprovado: "Aprovado",
  recusado: "Recusado",
  concluido: "Concluído",
  descartado: "Descartado",
  respondido: "Respondido",
  arquivado: "Arquivado",
};

export const OPCIONAIS_SUGERIDOS = [
  "Ar-condicionado",
  "Direção elétrica",
  "Vidros elétricos",
  "Trava elétrica",
  "Central multimídia",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Bancos em couro",
  "Piloto automático",
  "Rodas de liga leve",
  "Faróis full LED",
  "Airbag duplo",
  "Controle de estabilidade",
  "Tração 4x4",
];

export const IMAGEM_PADRAO =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80";

export function fotoCapa(veiculo: VeiculoComFotos): string {
  const fotos = [...(veiculo.veiculo_fotos ?? [])].sort((a, b) => a.ordem - b.ordem);
  const capa = fotos.find((f) => f.capa) ?? fotos[0];
  return capa?.url ?? IMAGEM_PADRAO;
}

export function precoFinal(veiculo: Pick<Veiculo, "preco" | "preco_promocional">): number {
  return Number(veiculo.preco_promocional ?? veiculo.preco);
}

export function tituloVeiculo(v: Pick<Veiculo, "marca" | "modelo" | "versao">): string {
  return [v.marca, v.modelo, v.versao].filter(Boolean).join(" ");
}
