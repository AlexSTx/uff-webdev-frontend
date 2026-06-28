import { useQuery } from "@tanstack/react-query";
import type { Pedido } from "../../interfaces/Pedido";
import useAPI from "../useAPI";
import { URL_PEDIDOS } from "../../util/constantes";

const useRecuperarPedidoPorId = (id: number, enabled: boolean) => {
  const { recuperarPorId } = useAPI<Pedido>(URL_PEDIDOS);

  return useQuery({
    queryKey: ["pedidos", id],
    queryFn: () => recuperarPorId(id),
    enabled,
    staleTime: 10_000,
  });
};
export default useRecuperarPedidoPorId;