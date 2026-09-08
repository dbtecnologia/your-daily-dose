import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Configuracoes } from "@/lib/catalogo";

export const CONFIG_FALLBACK: Configuracoes = {
  id: 1,
  nome: "AUTO SHOP",
  logo_url: null,
  telefone: "(14) 3000-0000",
  whatsapp: "5514999999999",
  email: "contato@autoshop.com.br",
  endereco: "Av. Brasil, 1000 - Centro, Bastos - SP",
  instagram: "https://instagram.com/autoshop",
  horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 13h",
  sobre_texto: "",
  taxa_juros_padrao: 1.49,
  updated_at: new Date().toISOString(),
};

export function useConfiguracoes() {
  const query = useQuery({
    queryKey: ["configuracoes"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("configuracoes").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return (data ?? CONFIG_FALLBACK) as Configuracoes;
    },
  });

  return { config: query.data ?? CONFIG_FALLBACK, ...query };
}
