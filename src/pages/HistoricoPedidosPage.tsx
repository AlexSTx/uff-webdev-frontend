import { useState } from "react";
import { Link } from "react-router-dom";
import useRecuperarPedidos from "../hooks/pedido/useRecuperarPedidos";
import type { StatusPedido } from "../interfaces/Pedido";

const FORMAS_PAGAMENTO_LABEL: Record<string, string> = {
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  PIX: "PIX",
  BOLETO: "Boleto",
};

const STATUS_INFO: Record<StatusPedido, { label: string; classe: string }> = {
  PENDENTE: { label: "Pendente", classe: "border-amber-400 bg-amber-100 text-amber-800" },
  PAGO: { label: "Pago", classe: "border-green-500 bg-green-100 text-green-800" },
  ENVIADO: { label: "Enviado", classe: "border-blue-500 bg-blue-100 text-blue-800" },
  ENTREGUE: { label: "Entregue", classe: "border-green-600 bg-green-100 text-green-800" },
  CANCELADO: { label: "Cancelado", classe: "border-red-500 bg-red-100 text-red-800" },
};

const formatarMoeda = (valor: number): string =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// O backend roda em UTC e serializa o LocalDateTime sem offset (ex.:
// "2026-06-27T22:45:00"). Anexamos "Z" quando não há offset para que o
// navegador o interprete como UTC e converta para o horário local.
const formatarData = (dataPedido: string): string => {
  if (!dataPedido) return "";
  const temOffset = /[zZ]|[+-]\d{2}:\d{2}$/.test(dataPedido);
  const data = new Date(temOffset ? dataPedido : `${dataPedido}Z`);
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const HistoricoPedidosPage = () => {
  const { data: pedidos, isPending, error } = useRecuperarPedidos();
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set());

  const alternar = (id: number) => {
    setExpandidos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  };

  if (error) throw error;
  if (isPending) return <p className="text-lg">Recuperando pedidos...</p>;

  const listaPedidos = pedidos ?? [];

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Meus Pedidos</h1>
      <hr className="mb-4" />

      {listaPedidos.length === 0 ? (
        <>
          <p className="text-lg">Você ainda não fez nenhum pedido.</p>
          <Link to="/home" className="btn-secondary mt-3 inline-block px-4 py-1">
            Ir às compras
          </Link>
        </>
      ) : (
        <div className="space-y-3">
          {listaPedidos.map((pedido) => {
            const aberto = expandidos.has(pedido.id);
            const status = STATUS_INFO[pedido.status] ?? {
              label: pedido.status,
              classe: "border-gray-400 bg-gray-100 text-gray-800",
            };
            return (
              <div
                key={pedido.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => alternar(pedido.id)}
                  aria-expanded={aberto}
                  className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-orange-50"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">Pedido #{pedido.id}</span>
                    <span className="text-sm text-gray-500">
                      {formatarData(pedido.dataPedido)}
                    </span>
                    <span
                      className={
                        "rounded-full border px-2 py-0.5 text-xs font-semibold " +
                        status.classe
                      }
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-orange-600">
                      {formatarMoeda(pedido.valorTotal)}
                    </span>
                    <i
                      className={
                        "bi bi-chevron-down transition-transform " +
                        (aberto ? "rotate-180" : "")
                      }
                    ></i>
                  </div>
                </button>

                {aberto && (
                  <div className="border-t border-gray-200 px-4 py-3">
                    <p className="mb-3 text-sm text-gray-600">
                      Forma de pagamento:{" "}
                      <strong>
                        {FORMAS_PAGAMENTO_LABEL[pedido.formaPagamento] ??
                          pedido.formaPagamento}
                      </strong>
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="table-header">Produto</th>
                            <th className="table-header">Preço unit.</th>
                            <th className="table-header">Qtd.</th>
                            <th className="table-header">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.itens.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                              <td className="table-cell">
                                <div className="flex items-center gap-3">
                                  <img src={"/" + item.imagem} width="40px" alt={item.nome} />
                                  <span>{item.nome}</span>
                                </div>
                              </td>
                              <td className="table-cell">{formatarMoeda(item.precoUnitario)}</td>
                              <td className="table-cell">{item.quantidade}</td>
                              <td className="table-cell">{formatarMoeda(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-right font-semibold">
                      Total: {formatarMoeda(pedido.valorTotal)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default HistoricoPedidosPage;
