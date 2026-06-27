import { useMutation } from "@tanstack/react-query";
import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import { queryClient } from "../../main";
import useCarrinhoStore from "../../store/CarrinhoStore";
import useTokenStore from "../../store/TokenStore";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE } from "../../util/constantes";

const useAlterarItemCarrinho = () => {
  const isLoggedIn = useTokenStore((s) => s.tokenResponse.idUsuario > 0);
  const { fetchWithAuth } = useFetchWithAuth();
  const alterarLocal = useCarrinhoStore((s) => s.alterarQuantidade);

  return useMutation({
    mutationFn: async ({ id, quantidade }: { id: number; quantidade: number }) => {
      if (isLoggedIn) {
        const response = await fetchWithAuth(
          `${URL_BASE}/carrinho/${id}?quantidade=${quantidade}`,
          { method: "PUT" },
        );
        return (await response.json()) as ItemCarrinho;
      }
      // No carrinho de convidado, id == produtoId
      alterarLocal(id, quantidade);
      return null;
    },
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      }
    },
  });
};
export default useAlterarItemCarrinho;