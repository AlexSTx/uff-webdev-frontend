import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRecuperarCarrinho from "../hooks/carrinho/useRecuperarCarrinho";
import useCriarPedido from "../hooks/pedido/useCriarPedido";
import type { FormaPagamento } from "../interfaces/Pedido";

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: "CARTAO_CREDITO", label: "Cartão de crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de débito" },
  { value: "PIX", label: "PIX" },
  { value: "BOLETO", label: "Boleto" },
];

const CheckoutPage = () => {
  const { data: itens, isPending: recuperando, error } = useRecuperarCarrinho();
  const { mutate: criarPedido, isPending: criando } = useCriarPedido();
  const navigate = useNavigate();
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>("CARTAO_CREDITO");

  if (error) throw error;
  if (recuperando) return <p className="text-lg">Recuperando carrinho...</p>;

  const total = (itens ?? []).reduce((acc, i) => acc + i.subtotal, 0);

  const confirmar = () => {
    criarPedido(formaPagamento, {
      onSuccess: (pedido) => navigate(`/pagamento/${pedido.id}`),
    });
  };

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Checkout</h1>
      <hr className="mb-4" />

      {!itens || itens.length === 0 ? (
        <>
          <p className="text-lg">Seu carrinho está vazio.</p>
          <Link to="/home" className="btn-secondary mt-3 inline-block px-4 py-1">
            Voltar à loja
          </Link>
        </>
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
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2 pe-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={"/" + item.imagem}
                          width="50px"
                          alt={item.nome}
                        />
                        <span>
                          {item.nome} ({item.descricao})
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pe-4">
                      {item.precoUnitario.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2 pe-4">{item.quantidade}</td>
                    <td className="py-2 pe-4">
                      {item.subtotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 font-semibold">Forma de pagamento</h2>
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

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Total:{" "}
              {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <button
              onClick={confirmar}
              disabled={criando}
              className="btn-primary px-4 py-1"
              type="button"
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
