import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRecuperarCarrinho from "../hooks/carrinho/useRecuperarCarrinho";
import useCriarPedido from "../hooks/pedido/useCriarPedido";
import useRemoverItemCarrinho from "../hooks/carrinho/useRemoverItemCarrinho";
import useAlterarItemCarrinho from "../hooks/carrinho/useAlterarItemCarrinho";
import type { FormaPagamento } from "../interfaces/Pedido";
import isErrorResponse from "../util/isErrorResponse";

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: "CARTAO_CREDITO", label: "Cartão de crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de débito" },
  { value: "PIX", label: "PIX" },
  { value: "BOLETO", label: "Boleto" },
];

const CheckoutPage = () => {
  const { data: itens, isPending: recuperando, error } = useRecuperarCarrinho();
  const { mutate: criarPedido, isPending: criando, error: erroCheckout } =
    useCriarPedido();
  const { mutate: removerItem, isPending: removendo } = useRemoverItemCarrinho();
  const { mutate: alterarQuantidade } = useAlterarItemCarrinho();
  const navigate = useNavigate();
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>("CARTAO_CREDITO");

  if (error) throw error;
  if (recuperando) return <p className="text-lg">Recuperando carrinho...</p>;

  const itensCarrinho = itens ?? [];
  const itensEsgotados = itensCarrinho.filter(
    (i) => !i.disponivel || i.estoqueDisponivel === 0,
  );
  const itensParciais = itensCarrinho.filter(
    (i) =>
      i.disponivel &&
      i.estoqueDisponivel > 0 &&
      i.estoqueDisponivel < i.quantidade,
  );
  const total = itensCarrinho
    .filter((i) => i.disponivel)
    .reduce((acc, i) => acc + i.subtotal, 0);

  // O POST /pedidos devolve 409 com ErrorResponse.map populado no formato
  //   { "produtoId=12": "Cereja: pedido=5, disponivel=0", ... }
  // quando há itens sem estoque suficiente no momento do checkout.
  const conflitoEstoque =
    isErrorResponse(erroCheckout) && erroCheckout.errorCode === 409
      ? erroCheckout
      : null;

  const confirmar = () => {
    criarPedido(formaPagamento, {
      onSuccess: (pedido) => navigate(`/pagamento/${pedido.id}`),
    });
  };

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Checkout</h1>
      <hr className="mb-4" />

      {itensCarrinho.length === 0 ? (
        <>
          <p className="text-lg">Seu carrinho está vazio.</p>
          <Link to="/home" className="btn-secondary mt-3 inline-block px-4 py-1">
            Voltar à loja
          </Link>
        </>
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
                  Eles aparecem apagados abaixo. Remova-os ou ajuste as
                  quantidades para continuar.
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
                  Ajuste a quantidade de cada item ao limite para prosseguir.
                </p>
              </div>
            </div>
          )}

          {conflitoEstoque && (
            <div className="alert-error" role="alert">
              <i className="bi bi-x-octagon-fill mt-0.5"></i>
              <div>
                <p className="font-semibold">
                  Não foi possível fechar o pedido: estoque insuficiente.
                </p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {Object.values(conflitoEstoque.map).map((descr) => {
                    const m = descr.match(
                      /^(?<nome>[^:]+):\s*pedido=(?<ped>\d+),\s*disponivel=(?<disp>\d+)$/,
                    );
                    if (m?.groups) {
                      const { nome, ped, disp } = m.groups;
                      return (
                        <li key={descr}>
                          {nome} — pedido: {ped}, disponível: {disp}
                        </li>
                      );
                    }
                    return <li key={descr}>{descr}</li>;
                  })}
                </ul>
                <p className="mt-1 text-sm">
                  Reveja os itens acima e ajuste as quantidades para continuar.
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
                    <tr key={item.id} className="border-b border-gray-200 transition hover:bg-orange-50 last:border-b-0">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <img
                            src={"/" + item.imagem}
                            width="50px"
                            alt={item.nome}
                            className={apagado ? "grayscale" : ""}
                          />
                          <span className={apagado ? "line-through" : ""}>
                            {item.nome} ({item.descricao})
                          </span>
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

          <div className="mt-6 card">
            <h2 className="mb-3 font-semibold">Forma de pagamento</h2>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
              className="rounded-md border-2 border-gray-300 px-3 py-2 outline-none hover:border-gray-500"
            >
              {FORMAS_PAGAMENTO.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-lg font-semibold">
              Total:{" "}
              {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <button
              onClick={confirmar}
              disabled={criando || itensEsgotados.length > 0 || itensParciais.length > 0}
              className="btn-primary px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              title={
                itensEsgotados.length > 0
                  ? "Remova os itens esgotados para continuar"
                  : itensParciais.length > 0
                    ? "Ajuste as quantidades acima do limite para continuar"
                    : undefined
              }
            >
              {criando ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default CheckoutPage;