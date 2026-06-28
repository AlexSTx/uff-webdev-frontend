import { useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { queryClient } from "../../main";
import useTokenStore from "../../store/TokenStore";
import { URL_WEBSOCKET } from "../../util/constantes";
import type { Produto } from "../../interfaces/Produto";

/**
 * Assina o tópico do produto em tempo real no backend e atualiza o cache do
 * react-query quando um EstoqueEsgotadoEvent chega. A página que está
 * renderizando via useRecuperarProdutoPorId reagirá ao novo qtdEstoque
 * automaticamente (e ao estado "Esgotado").
 *
 * Não é genérico por enquanto: cobre apenas o evento específico do produto.
 */
const useEstoqueProdutoWS = (produtoId: number | undefined) => {
  const token = useTokenStore((s) => s.tokenResponse.token);

  useEffect(() => {
    if (produtoId == null || Number.isNaN(produtoId)) return;
    if (!token) return; // anônimo: não conecta (a página do produto é pública,
                       // mas neste toy app ainda pedimos login para o WS)

    // Se já temos dados em cache, atualiza só o campo relevante.
    const aplicarEvento = (payload: {
      produtoId: number;
      qtdEstoqueFinal: number;
    }) => {
      if (payload.produtoId !== produtoId) return;
      queryClient.setQueryData<Produto>(["produtos", produtoId], (antigo) =>
        antigo ? { ...antigo, qtdEstoque: payload.qtdEstoqueFinal } : antigo,
      );
    };

    const client = new Client({
      brokerURL: `${URL_WEBSOCKET}?token=${encodeURIComponent(token)}`,
      // Sessões STOMP sem heartbeat do servidor podem ficar "presas" em
      // modo reconexão; mantemos um heartbeat cliente → servidor.
      heartbeatOutgoing: 10_000,
      heartbeatIncoming: 10_000,
      onConnect: () => {
        client.subscribe(`/topic/produtos/${produtoId}`, (msg: IMessage) => {
          try {
            aplicarEvento(JSON.parse(msg.body));
          } catch (e) {
            console.error("Falha ao interpretar EstoqueEsgotadoEvent:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: (ev) => {
        // silencioso: só logamos em debug para evitar poluir o console
        console.debug("WebSocket fechado:", ev.reason);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [produtoId, token]);
};

export default useEstoqueProdutoWS;