import { useMutation } from "@tanstack/react-query";
import type { FormaPagamento, Pedido } from "../../interfaces/Pedido";
import { queryClient } from "../../main";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE, URL_PEDIDOS } from "../../util/constantes";

const useCriarPedido = () => {
  const { fetchWithAuth } = useFetchWithAuth();

  return useMutation({
    mutationFn: async (formaPagamento: FormaPagamento) => {
      const response = await fetchWithAuth(`${URL_BASE}${URL_PEDIDOS}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ formaPagamento }),
      });
      return (await response.json()) as Pedido;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["pedidos"], exact: false });
    },
  });
};
export default useCriarPedido;
