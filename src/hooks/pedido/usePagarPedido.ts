import { useMutation } from "@tanstack/react-query";
import type { Pedido } from "../../interfaces/Pedido";
import { queryClient } from "../../main";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE, URL_PEDIDOS } from "../../util/constantes";

const usePagarPedido = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetchWithAuth(`${URL_BASE}${URL_PEDIDOS}/${id}/pagar`, {
        method: "POST",
      });
      return (await response.json()) as Pedido;
    },
    onSuccess: () => {
      // Ao pagar, o backend esvazia o carrinho do usuário. Esvaziamos o cache
      // imediatamente (em vez de só invalidar) para que o carrinho do próprio
      // comprador apareça vazio na hora — sem depender do timing do refetch,
      // que não dispara enquanto a query do carrinho está inativa (estamos na
      // tela de confirmação). A invalidação seguinte confirma com o backend.
      queryClient.setQueryData(["carrinho"], []);
      queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["pedidos"], exact: false });
    },
  });
};
export default usePagarPedido;
