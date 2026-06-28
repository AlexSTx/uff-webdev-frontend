import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCancelarPedido from "../hooks/pedido/useCancelarPedido";
import useRecuperarPedidoPorId from "../hooks/pedido/useRecuperarPedidoPorId";
import usePagarPedido from "../hooks/pedido/usePagarPedido";

const FORMAS_PAGAMENTO_LABEL: Record<string, string> = {
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  PIX: "PIX",
  BOLETO: "Boleto",
};

const PRAZO_MINUTOS = 10;

// O backend roda em UTC (container) e serializa o LocalDateTime sem offset
// (ex.: "2026-06-27T22:45:00"). O `new Date(string)` interpreta esse formato
// como horário *local* do navegador, o que no Brasil (UTC-3) faz o prazo
// passar a valer ~3h a mais do que o real. Por isso anexamos o "Z" para
// indicar que o horário está em UTC.
const parseDataPedido = (dataPedido: string): Date => {
  if (!dataPedido) return new Date(NaN);
  const temOffset = /[zZ]|[+-]\d{2}:\d{2}$/.test(dataPedido);
  return new Date(temOffset ? dataPedido : `${dataPedido}Z`);
};

const PagamentoPage = () => {
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);
  const { data: pedido, isPending, error } = useRecuperarPedidoPorId(
    pedidoId,
    !Number.isNaN(pedidoId),
  );
  const { mutate: pagar, isPending: pagando } = usePagarPedido();
  const { mutate: cancelar, isPending: cancelando } = useCancelarPedido();
  const [pago, setPago] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [expirado, setExpirado] = useState(false);

  // Quando o prazo de 10 minutos do pedido pendente acaba, marca como
  // expirado e reconsulta o pedido para refletir o cancelamento do backend.
  useEffect(() => {
    if (!pedido || pedido.status !== "PENDENTE") return;
    const deadline =
      parseDataPedido(pedido.dataPedido).getTime() + PRAZO_MINUTOS * 60 * 1000;
    const restante = deadline - Date.now();
    const timeout = setTimeout(
      () => {
        setExpirado(true);
      },
      Math.max(0, restante),
    );
    return () => clearTimeout(timeout);
  }, [pedido]);

  if (error) throw error;
  if (isPending || !pedido)
    return <p className="text-lg">Recuperando pedido...</p>;

  if (pago || pedido.status === "PAGO") {
    return (
      <>
        <h1 className="mb-1 text-xl font-semibold">Pagamento confirmado</h1>
        <hr className="mb-4" />
        <p>
          Pagamento do pedido <strong>#{pedido.id}</strong> confirmado com
          sucesso! Status atual: <strong>PAGO</strong>.
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/home" className="btn-secondary px-4 py-1">
            Voltar à loja
          </Link>
          <Link to="/carrinho" className="btn-secondary px-4 py-1">
            Ir para o carrinho
          </Link>
        </div>
      </>
    );
  }

  if (cancelado || pedido.status === "CANCELADO") {
    return (
      <>
        <h1 className="mb-1 text-xl font-semibold">Pedido cancelado</h1>
        <hr className="mb-4" />
        <p>
          Pedido <strong>#{pedido.id}</strong> cancelado.
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/home" className="btn-secondary px-4 py-1">
            Voltar à loja
          </Link>
        </div>
      </>
    );
  }

  if (expirado) {
    return (
      <>
        <h1 className="mb-1 text-xl font-semibold">Tempo esgotado</h1>
        <hr className="mb-4" />
        <p>
          Tempo para pagamento expirado, pedido <strong>#{pedido.id}</strong>{" "}
          cancelado. Tente novamente.
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/home" className="btn-secondary px-4 py-1">
            Voltar à loja
          </Link>
          <Link to="/carrinho" className="btn-secondary px-4 py-1">
            Ir para o carrinho
          </Link>
        </div>
      </>
    );
  }

  if (pedido.status !== "PENDENTE") {
    return (
      <>
        <h1 className="mb-1 text-xl font-semibold">Pedido</h1>
        <hr className="mb-4" />
        <p>
          Pedido <strong>#{pedido.id}</strong> não está mais pendente (status
          atual: <strong>{pedido.status}</strong>).
        </p>
        <Link to="/home" className="btn-secondary mt-3 inline-block px-4 py-1">
          Voltar à loja
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Pagamento</h1>
      <hr className="mb-4" />

      <div className="mb-4">
        <p>
          Pedido <strong>#{pedido.id}</strong>
        </p>
        <p>
          Forma de pagamento:{" "}
          <strong>
            {FORMAS_PAGAMENTO_LABEL[pedido.formaPagamento] ?? pedido.formaPagamento}
          </strong>
        </p>
        <p>
          Total:{" "}
          {pedido.valorTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Clique abaixo para confirmar o pagamento. A confirmação do pagamento fica disponível por {PRAZO_MINUTOS} minutos após o fechamento do pedido.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => pagar(pedido.id, { onSuccess: () => setPago(true) })}
          disabled={pagando || cancelando}
          className="btn-primary px-4 py-2"
          type="button"
        >
          {pagando ? "Processando pagamento..." : "Confirmar Pagamento"}
        </button>
        <button
          onClick={() =>
            cancelar(pedido.id, { onSuccess: () => setCancelado(true) })
          }
          disabled={pagando || cancelando}
          className="btn-danger px-4 py-2"
          type="button"
        >
          {cancelando ? "Cancelando..." : "Cancelar pedido"}
        </button>
      </div>

      {pagando && (
        <p className="mt-3 text-sm text-gray-600">
          Aguarde, processando seu pagamento...
        </p>
      )}
    </>
  );
};
export default PagamentoPage;