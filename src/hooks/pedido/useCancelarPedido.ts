import { useMutation } from "@tanstack/react-query";
import type { Pedido } from "../../interfaces/Pedido";
import { queryClient } from "../../main";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE, URL_PEDIDOS } from "../../util/constantes";

const useCancelarPedido = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetchWithAuth(
        `${URL_BASE}${URL_PEDIDOS}/${id}/cancelar`,
        { method: "POST" },
      );
      return (await response.json()) as Pedido;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["pedidos"], exact: false });
    },
  });
};
export default useCancelarPedido;