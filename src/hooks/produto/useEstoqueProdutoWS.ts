import { useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { queryClient } from "../../main";
import useTokenStore from "../../store/TokenStore";
import { URL_WEBSOCKET } from "../../util/constantes";
import type { Produto } from "../../interfaces/Produto";

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
  const token = useTokenStore((s) => s.tokenResponse.token);

  useEffect(() => {
    if (produtoId == null || Number.isNaN(produtoId)) return;
    // A página de produto é pública, então o WS deve conectar mesmo para
    // anônimos — o interceptor do backend aceita handshake sem token.
    // O termo `&token=` pode ficar vazio e o JwtHandshakeInterceptor
    // apenas registra a conexão como anônima.

    // Aceita EstoqueEsgotadoEvent (qtdEstoqueFinal) e EstoqueRepostoEvent
    // (qtdEstoqueAtual). Independente do tipo, sobrescrevemos o qtdEstoque
    // em cache com o novo valor — a UI (ProdutoPage) reage sozinha.
    const aplicarEvento = (payload: {
      produtoId: number;
      qtdEstoqueFinal?: number;
      qtdEstoqueAtual?: number;
    }) => {
      if (payload.produtoId !== produtoId) return;
      const novoEstoque = payload.qtdEstoqueFinal ?? payload.qtdEstoqueAtual;
      if (novoEstoque == null) return;
      queryClient.setQueryData<Produto>(["produtos", produtoId], (antigo) =>
        antigo ? { ...antigo, qtdEstoque: novoEstoque } : antigo,
      );
    };

    const wsUrl = token
      ? `${URL_WEBSOCKET}?token=${encodeURIComponent(token)}`
      : URL_WEBSOCKET;

    const client = new Client({
      brokerURL: wsUrl,
      // Sessões STOMP sem heartbeat do servidor podem ficar "presas" em
      // modo reconexão; mantemos um heartbeat cliente → servidor.
      heartbeatOutgoing: 10_000,
      heartbeatIncoming: 10_000,
      onConnect: () => {
        console.debug("[WS] conectado, assinando /topic/produtos/" + produtoId);
        client.subscribe(`/topic/produtos/${produtoId}`, (msg: IMessage) => {
          try {
            aplicarEvento(JSON.parse(msg.body));
          } catch (e) {
            console.error("Falha ao interpretar evento de estoque:", e);
          }
        });
      },
      onWebSocketError: (e) => {
        console.error("[WS] erro WebSocket:", e);
      },
      onStompError: (frame) => {
        console.error("[WS] erro STOMP:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: (ev) => {
        console.debug("[WS] fechado:", ev.reason);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [produtoId, token]);
};

export default useEstoqueProdutoWS;