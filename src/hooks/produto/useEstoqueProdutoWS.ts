import { queryClient } from "../../main";
import type { Produto } from "../../interfaces/Produto";
import useEstoqueWS, { type EstoqueEvento } from "./useEstoqueWS";

/**
 * Assina o tópico do produto em tempo real no backend e atualiza o cache do
 * react-query quando um evento de estoque (Esgotado ou Reposto) chega. A
 * página que está renderizando via useRecuperarProdutoPorId reagirá ao novo
 * qtdEstoque automaticamente (e ao estado "Esgotado").
 *
 * Ambos os eventos são emitidos no mesmo tópico /topic/produtos/{id}; o
 * nome do campo com o novo estoque difere (qtdEstoqueFinal para esgotado,
 * qtdEstoqueAtual para reposto), então aceitamos os dois.
 */
const useEstoqueProdutoWS = (produtoId: number | undefined) => {
  const ids = produtoId == null || Number.isNaN(produtoId) ? [] : [produtoId];

  useEstoqueWS(ids, (evento: EstoqueEvento) => {
    // Independente do tipo, sobrescrevemos o qtdEstoque em cache com o novo
    // valor — a UI (ProdutoPage) reage sozinha.
    const novoEstoque = evento.qtdEstoqueFinal ?? evento.qtdEstoqueAtual;
    if (novoEstoque == null) return;
    queryClient.setQueryData<Produto>(
      ["produtos", evento.produtoId],
      (antigo) => (antigo ? { ...antigo, qtdEstoque: novoEstoque } : antigo),
    );
  });
};

export default useEstoqueProdutoWS;
