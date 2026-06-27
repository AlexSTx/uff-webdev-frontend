import { useQuery } from "@tanstack/react-query";
import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import useAPI from "../useAPI";
import { URL_CARRINHO } from "../../util/constantes";

const useRecuperarCarrinhoAPI = (enabled: boolean) => {
  const { recuperar } = useAPI<ItemCarrinho>(URL_CARRINHO);

  return useQuery({
    queryKey: ["carrinho"],
    queryFn: recuperar,
    enabled,
    staleTime: 10_000,
  });
};
export default useRecuperarCarrinhoAPI;