import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import useCarrinhoStore from "../../store/CarrinhoStore";
import useTokenStore from "../../store/TokenStore";
import useRecuperarCarrinhoAPI from "./useRecuperarCarrinhoAPI";

const useRecuperarCarrinho = () => {
  const isLoggedIn = useTokenStore((s) => s.tokenResponse.idUsuario > 0);
  const { data: apiData, isPending: apiPending, error: apiError } =
    useRecuperarCarrinhoAPI(isLoggedIn);
  const itensLocal = useCarrinhoStore((s) => s.itens);

  if (isLoggedIn) {
    return { data: apiData, isPending: apiPending, error: apiError };
  }

  // Modo convidado: carrinho persistido no navegador (localStorage).
  const data: ItemCarrinho[] = itensLocal.map((i) => ({
    id: i.produto.id!,
    produtoId: i.produto.id!,
    nome: i.produto.nome,
    descricao: i.produto.descricao,
    imagem: i.produto.imagem,
    precoUnitario: i.produto.preco ?? 0,
    quantidade: i.quantidade,
    subtotal: (i.produto.preco ?? 0) * i.quantidade,
    dataAdicao: "",
  }));
  return { data, isPending: false, error: null };
};
export default useRecuperarCarrinho;