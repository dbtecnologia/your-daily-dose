export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Parcela pela Tabela Price. Retorna 0 quando os parâmetros são inválidos. */
export function calcularParcela(valorFinanciado: number, taxaMensal: number, parcelas: number): number {
  if (valorFinanciado <= 0 || parcelas <= 0) return 0;
  const i = taxaMensal / 100;
  if (i <= 0) return valorFinanciado / parcelas;
  return (valorFinanciado * i) / (1 - Math.pow(1 + i, -parcelas));
}

export function whatsappLink(numero: string, mensagem: string): string {
  return `https://wa.me/${onlyDigits(numero)}?text=${encodeURIComponent(mensagem)}`;
}
