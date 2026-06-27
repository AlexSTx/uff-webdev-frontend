import { useMutation } from "@tanstack/react-query";
import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import type { Produto } from "../../interfaces/Produto";
import { queryClient } from "../../main";
import useCarrinhoStore from "../../store/CarrinhoStore";
import useTokenStore from "../../store/TokenStore";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE, URL_CARRINHO } from "../../util/constantes";

export interface AdicionarItemPayload {
  produto: Produto;
  quantidade: number;
}

const useAdicionarItemCarrinho = () => {
  const isLoggedIn = useTokenStore((s) => s.tokenResponse.idUsuario > 0);
  const { fetchWithAuth } = useFetchWithAuth();
  const adicionarLocal = useCarrinhoStore((s) => s.adicionarProduto);

  return useMutation({
    mutationFn: async (payload: AdicionarItemPayload) => {
      if (isLoggedIn) {
        const response = await fetchWithAuth(`${URL_BASE}${URL_CARRINHO}`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            produtoId: payload.produto.id,
            quantidade: payload.quantidade,
          }),
        });
        return (await response.json()) as ItemCarrinho;
      }
      adicionarLocal(payload.produto, payload.quantidade);
      return null;
    },
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      }
    },
  });
};
export default useAdicionarItemCarrinho;