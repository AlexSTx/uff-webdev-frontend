import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import useCarrinhoStore from "../../store/CarrinhoStore";
import useTokenStore from "../../store/TokenStore";
import useFetchWithAuth from "../useFetchWithAuth";
import { URL_BASE } from "../../util/constantes";

const useLimparCarrinho = () => {
  const isLoggedIn = useTokenStore((s) => s.tokenResponse.idUsuario > 0);
  const { fetchWithAuth } = useFetchWithAuth();
  const limparLocal = useCarrinhoStore((s) => s.limpar);

  return useMutation({
    mutationFn: async () => {
      if (isLoggedIn) {
        await fetchWithAuth(`${URL_BASE}/carrinho`, { method: "DELETE" });
      } else {
        limparLocal();
      }
    },
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
      }
    },
  });
};
export default useLimparCarrinho;