import { useMutation } from "@tanstack/react-query";
import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import { queryClient } from "../../main";
import useCarrinhoStore from "../../store/CarrinhoStore";
import useTokenStore from "../../store/TokenStore";
import useAPI from "../useAPI";
import { URL_CARRINHO } from "../../util/constantes";

const useRemoverItemCarrinho = () => {
  const isLoggedIn = useTokenStore((s) => s.tokenResponse.idUsuario > 0);
  const { removerPorId } = useAPI<ItemCarrinho>(URL_CARRINHO);
  const removerLocal = useCarrinhoStore((s) => s.removerProduto);

  return useMutation({
    mutationFn: async (id: number) => {
      if (isLoggedIn) {
        await removerPorId(id);
      } else {
        // No carrinho de convidado, id == produtoId
        removerLocal(id);
      }
    },
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      }
    },
  });
};
export default useRemoverItemCarrinho;