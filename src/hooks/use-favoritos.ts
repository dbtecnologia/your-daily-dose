import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useFavoritos(userId: string | undefined) {
  return useQuery({
    queryKey: ["favoritos", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favoritos")
        .select("veiculo_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return data.map((f) => f.veiculo_id);
    },
  });
}

export function useToggleFavorito(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ veiculoId, ativo }: { veiculoId: string; ativo: boolean }) => {
      if (!userId) throw new Error("Entre na sua conta para favoritar veículos.");
      if (ativo) {
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("user_id", userId)
          .eq("veiculo_id", veiculoId);
        if (error) throw error;
        return false;
      }
      const { error } = await supabase
        .from("favoritos")
        .insert({ user_id: userId, veiculo_id: veiculoId });
      if (error) throw error;
      return true;
    },
    onSuccess: (adicionado) => {
      void queryClient.invalidateQueries({ queryKey: ["favoritos"] });
      toast.success(adicionado ? "Adicionado aos favoritos" : "Removido dos favoritos");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
