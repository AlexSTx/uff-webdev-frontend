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

  const total = (itens ?? []).reduce(
    (acc, i) => acc + i.subtotal,
    0,
  );

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Carrinho</h1>
      <hr className="mb-4" />

      {!itens || itens.length === 0 ? (
        <p className="text-lg">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-2 pe-4">Produto</th>
                  <th className="py-2 pe-4">Preço unit.</th>
                  <th className="py-2 pe-4">Quantidade</th>
                  <th className="py-2 pe-4">Subtotal</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2 pe-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/produtos/${item.produtoId}`}>
                          <img
                            src={"/" + item.imagem}
                            width="50px"
                            alt={item.nome}
                          />
                        </Link>
                        <Link
                          to={`/produtos/${item.produtoId}`}
                          className="hover:underline"
                        >
                          {item.nome} ({item.descricao})
                        </Link>
                      </div>
                    </td>
                    <td className="py-2 pe-4">
                      {item.precoUnitario.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2 pe-4">
                      <input
                        type="number"
                        min={1}
                        value={item.quantidade}
                        onChange={(e) =>
                          alterarQuantidade({
                            id: item.id,
                            quantidade: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-20 rounded-md border-2 border-gray-300 px-2 py-1 outline-none hover:border-gray-500"
                      />
                    </td>
                    <td className="py-2 pe-4">
                      {item.subtotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
                ))}
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