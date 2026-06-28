import { Link } from "react-router-dom";
import useRecuperarCarrinho from "../hooks/carrinho/useRecuperarCarrinho";
import useRemoverItemCarrinho from "../hooks/carrinho/useRemoverItemCarrinho";
import useAlterarItemCarrinho from "../hooks/carrinho/useAlterarItemCarrinho";
import useLimparCarrinho from "../hooks/carrinho/useLimparCarrinho";

const CarrinhoPage = () => {
  const { data: itens, isPending: recuperando, error } = useRecuperarCarrinho();
  const { mutate: removerItem, isPending: removendo } = useRemoverItemCarrinho();
  const { mutate: alterarQuantidade } = useAlterarItemCarrinho();
  const { mutate: limpar, isPending: limpando } = useLimparCarrinho();

  if (error) throw error;
  if (recuperando) return <p className="text-lg">Recuperando carrinho...</p>;

  const itensCarrinho = itens ?? [];
  const itensEsgotados = itensCarrinho.filter(
    (i) => !i.disponivel || i.estoqueDisponivel === 0,
  );
  // Itens "parciais": produto ainda tem estoque físico (> 0) mas menos do
  // que a quantidade que está no carrinho. Não bloqueiam o checkout mas
  // precisam ser ajustados para não estourar o estoque no pedido.
  const itensParciais = itensCarrinho.filter(
    (i) =>
      i.disponivel &&
      i.estoqueDisponivel > 0 &&
      i.estoqueDisponivel < i.quantidade,
  );
  // O total só considera itens ainda compráveis — os esgotados não podem
  // ser finalizados e serão removidos do pedido no checkout.
  const total = itensCarrinho
    .filter((i) => i.disponivel)
    .reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Carrinho</h1>
      <hr className="mb-4" />

      {itensCarrinho.length === 0 ? (
        <p className="text-lg">Seu carrinho está vazio.</p>
      ) : (
        <>
          {itensEsgotados.length > 0 && (
            <div className="alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle-fill mt-0.5"></i>
              <div>
                <p className="font-semibold">
                  Alguns itens do seu carrinho esgotaram enquanto você esteve fora.
                </p>
                <p className="text-sm">
                  Eles aparecem apagados abaixo. Remova-os para limpar o
                  carrinho, ou continue com os itens disponíveis.
                </p>
              </div>
            </div>
          )}

          {itensParciais.length > 0 && (
            <div
              className="mb-4 flex items-start gap-3 rounded border-2 border-orange-500 bg-orange-50 px-4 py-3 text-orange-900"
              role="alert"
            >
              <i className="bi bi-exclamation-circle-fill mt-0.5"></i>
              <div>
                <p className="font-semibold">
                  A quantidade pedida de alguns itens ultrapassa o estoque
                  disponível.
                </p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {itensParciais.map((i) => (
                    <li key={i.id}>
                      {i.nome} — pedido: {i.quantidade}, disponível:{" "}
                      {i.estoqueDisponivel}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-sm">
                  Ajuste a quantidade de cada item ao limite para prosseguir
                  com o pedido.
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-100">
                  <th className="table-header">Produto</th>
                  <th className="table-header">Preço unit.</th>
                  <th className="table-header">Quantidade</th>
                  <th className="table-header">Subtotal</th>
                  <th className="py-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {itensCarrinho.map((item) => {
                  const apagado = !item.disponivel || item.estoqueDisponivel === 0;
                  const limite = apagado ? 1 : item.estoqueDisponivel;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 transition hover:bg-orange-50 last:border-b-0"
                    >
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Link to={`/produtos/${item.produtoId}`}>
                            <img
                              src={"/" + item.imagem}
                              width="50px"
                              alt={item.nome}
                              className={apagado ? "grayscale" : ""}
                            />
                          </Link>
                          <Link
                            to={`/produtos/${item.produtoId}`}
                            className={apagado ? "line-through hover:underline" : "hover:underline"}
                          >
                            {item.nome} ({item.descricao})
                          </Link>
                        </div>
                      </td>
                      <td className="table-cell">
                        {apagado ? (
                          <span className="badge-danger">Esgotado</span>
                        ) : (
                          item.precoUnitario.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        )}
                      </td>
                      <td className="table-cell">
                        {apagado ? (
                          <span className="text-gray-500">—</span>
                        ) : (
                          <input
                            type="number"
                            min={1}
                            max={limite}
                            value={item.quantidade}
                            onChange={(e) =>
                              alterarQuantidade({
                                id: item.id,
                                quantidade: Math.min(
                                  Math.max(1, Number(e.target.value)),
                                  limite,
                                ),
                              })
                            }
                            className="input-sm"
                          />
                        )}
                      </td>
                      <td className="table-cell">
                        {apagado ? (
                          <span className="text-gray-500">—</span>
                        ) : (
                          item.subtotal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        )}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => removerItem(item.id)}
                          disabled={removendo}
                          className="btn-danger px-3 py-1"
                          type="button"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => limpar()}
              disabled={limpando}
              className="btn-secondary px-4 py-1"
              type="button"
            >
              Limpar carrinho
            </button>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">
                Total:{" "}
                {total.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <Link to="/checkout" className="btn-primary px-4 py-1">
                Fechar pedido
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CarrinhoPage;