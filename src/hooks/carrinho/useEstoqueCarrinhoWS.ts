import { queryClient } from "../../main";
import type { Produto } from "../../interfaces/Produto";
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
 * Observações:
 * - O carrinho de convidado vive no localStorage e sua query fica desabilitada;
 *   a invalidação é inócua nesse caso (o convidado não recebe atualização ao
 *   vivo, comportamento já documentado em useRecuperarCarrinho).
 * - O backend só emite evento no limite do zero (esgotou / voltou a ter
 *   estoque). Uma baixa parcial (ex.: 10 → 3) não dispara evento, então o
 *   estado "parcial" só é reavaliado no próximo fetch do carrinho.
 */
const useEstoqueCarrinhoWS = (produtoIds: number[]) => {
  useEstoqueWS(produtoIds, (evento: EstoqueEvento) => {
    const novoEstoque = evento.qtdEstoqueFinal ?? evento.qtdEstoqueAtual;
    if (novoEstoque != null) {
      queryClient.setQueryData<Produto>(
        ["produtos", evento.produtoId],
        (antigo) => (antigo ? { ...antigo, qtdEstoque: novoEstoque } : antigo),
      );
    }
    queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
  });
};

export default useEstoqueCarrinhoWS;
