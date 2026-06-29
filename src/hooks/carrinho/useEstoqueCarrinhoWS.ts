import { queryClient } from "../../main";
import type { Produto } from "../../interfaces/Produto";
import type { ItemCarrinho } from "../../interfaces/ItemCarrinho";
import useEstoqueWS, { type EstoqueEvento } from "../produto/useEstoqueWS";

/**
 * Assina, em tempo real, os tópicos de estoque de todos os produtos presentes
 * no carrinho. Quando qualquer item esgota (EstoqueEsgotadoEvent) ou é reposto
 * (EstoqueRepostoEvent), invalida o cache do carrinho para que o backend
 * recalcule `disponivel`/`estoqueDisponivel` e a CarrinhoPage atualize os
 * avisos de "esgotado"/"parcial" e o total — sem o usuário recarregar a página.
 *
 * Também sincroniza o cache do produto (["produtos", id]) caso a ProdutoPage
 * esteja montada em paralelo.
 *
 * Aplicamos o novo estoque que vem NO PRÓPRIO evento direto no cache do
 * carrinho (atualização instantânea e determinística) e, em seguida,
 * invalidamos para o backend reconciliar subtotal/total/parcial. Isso evita
 * depender só do refetch: o backend agora emite o evento após o commit
 * (ver EstoqueEventTransactionalForwarder), então o refetch é consistente, mas
 * aplicar o payload na hora elimina qualquer latência de ida e volta.
 *
 * Observações:
 * - O carrinho de convidado vive no localStorage e sua query fica desabilitada;
 *   tanto o setQueryData quanto a invalidação são inócuos nesse caso (o
 *   convidado não recebe atualização ao vivo, conforme useRecuperarCarrinho).
 * - O backend emite a CADA mudança de estoque, inclusive baixas/altas parciais
 *   (ex.: 10 → 3), então o estado "parcial" também é refletido em tempo real.
 */
const useEstoqueCarrinhoWS = (produtoIds: number[]) => {
  useEstoqueWS(produtoIds, (evento: EstoqueEvento) => {
    const novoEstoque = evento.qtdEstoqueFinal ?? evento.qtdEstoqueAtual;
    if (novoEstoque == null) return;

    queryClient.setQueryData<Produto>(
      ["produtos", evento.produtoId],
      (antigo) => (antigo ? { ...antigo, qtdEstoque: novoEstoque } : antigo),
    );

    // Verdade do evento aplicada na hora: marca o item esgotado/atualiza o
    // limite sem esperar o refetch. Só forçamos disponivel=false ao esgotar;
    // na reposição deixamos o refetch confirmar (disponivel também depende da
    // flag do produto no backend, não só do estoque).
    queryClient.setQueryData<ItemCarrinho[]>(["carrinho"], (itens) =>
      itens?.map((i) =>
        i.produtoId === evento.produtoId
          ? {
              ...i,
              estoqueDisponivel: novoEstoque,
              disponivel: novoEstoque > 0 ? i.disponivel : false,
            }
          : i,
      ),
    );

    queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
  });
};

export default useEstoqueCarrinhoWS;
