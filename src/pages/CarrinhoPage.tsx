import { Link } from "react-router-dom";
import useCarrinhoStore from "../store/CarrinhoStore";

const CarrinhoPage = () => {
  const itens = useCarrinhoStore((s) => s.itens);
  const alterarQuantidade = useCarrinhoStore((s) => s.alterarQuantidade);
  const removerProduto = useCarrinhoStore((s) => s.removerProduto);
  const limpar = useCarrinhoStore((s) => s.limpar);

  const total = itens.reduce(
    (acc, i) => acc + (i.produto.preco ?? 0) * i.quantidade,
    0,
  );

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Carrinho</h1>
      <hr className="mb-4" />

      {itens.length === 0 ? (
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
                  <tr
                    key={item.produto.id}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2 pe-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/produtos/${item.produto.id}`}>
                          <img
                            src={"/" + item.produto.imagem}
                            width="50px"
                            alt={item.produto.nome}
                          />
                        </Link>
                        <Link
                          to={`/produtos/${item.produto.id}`}
                          className="hover:underline"
                        >
                          {item.produto.nome} ({item.produto.descricao})
                        </Link>
                      </div>
                    </td>
                    <td className="py-2 pe-4">
                      {(item.produto.preco ?? 0).toLocaleString("pt-BR", {
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
                          alterarQuantidade(
                            item.produto.id!,
                            Math.max(1, Number(e.target.value)),
                          )
                        }
                        className="w-20 rounded-md border-2 border-gray-300 px-2 py-1 outline-none hover:border-gray-500"
                      />
                    </td>
                    <td className="py-2 pe-4">
                      {((item.produto.preco ?? 0) * item.quantidade).toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removerProduto(item.produto.id!)}
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
              onClick={limpar}
              className="btn-secondary px-4 py-1"
              type="button"
            >
              Limpar carrinho
            </button>
            <div className="text-lg font-semibold">
              Total:{" "}
              {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CarrinhoPage;