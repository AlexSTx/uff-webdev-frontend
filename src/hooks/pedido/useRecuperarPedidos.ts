import { useQuery } from "@tanstack/react-query";
import type { Pedido } from "../../interfaces/Pedido";
import useAPI from "../useAPI";
import { URL_PEDIDOS } from "../../util/constantes";

// GET /pedidos — o backend já filtra pelos pedidos do usuário autenticado
// (ordenados do mais recente) e devolve cada pedido com seus itens.
const useRecuperarPedidos = () => {
  const { recuperar } = useAPI<Pedido>(URL_PEDIDOS);

  return useQuery({
    queryKey: ["pedidos"],
    queryFn: () => recuperar(),
    staleTime: 10_000,
  });
};
export default useRecuperarPedidos;
