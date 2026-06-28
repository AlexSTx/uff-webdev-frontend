import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import useTokenStore from "../../store/TokenStore";
import { URL_WEBSOCKET } from "../../util/constantes";

/**
 * Evento de estoque emitido pelo backend no tópico /topic/produtos/{id}.
 * EstoqueEsgotadoEvent traz `qtdEstoqueFinal` e EstoqueRepostoEvent traz
 * `qtdEstoqueAtual`; ambos chegam no mesmo tópico.
 */
export interface EstoqueEvento {
  produtoId: number;
  qtdEstoqueFinal?: number;
  qtdEstoqueAtual?: number;
}

/**
 * Conecta ao broker STOMP e assina o tópico de estoque de cada produto
 * informado (/topic/produtos/{id}), repassando todo evento recebido para
 * `onEvento`. Mantém uma única conexão e reassina quando a lista de ids
 * (ou o token) muda.
 *
 * O callback é guardado em ref para que mudanças na sua identidade entre
 * renders não derrubem e recriem a conexão a cada render.
 *
 * A página de produto é pública, então a conexão é aberta mesmo sem token —
 * o JwtHandshakeInterceptor do backend aceita o handshake como anônimo.
 */
const useEstoqueWS = (
  produtoIds: number[],
  onEvento: (evento: EstoqueEvento) => void,
) => {
  const token = useTokenStore((s) => s.tokenResponse.token);

  const onEventoRef = useRef(onEvento);
  useEffect(() => {
    onEventoRef.current = onEvento;
  }, [onEvento]);

  // Lista estável (sem nulos/NaN, sem duplicatas e ordenada) usada como
  // dependência do efeito — evita reconectar quando só a ordem/identidade
  // do array muda entre renders.
  const idsKey = [
    ...new Set(produtoIds.filter((id) => id != null && !Number.isNaN(id))),
  ]
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",").map(Number) : [];
    if (ids.length === 0) return;

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
        console.debug("[WS] conectado, assinando produtos:", ids.join(", "));
        ids.forEach((id) => {
          client.subscribe(`/topic/produtos/${id}`, (msg: IMessage) => {
            try {
              onEventoRef.current(JSON.parse(msg.body));
            } catch (e) {
              console.error("Falha ao interpretar evento de estoque:", e);
            }
          });
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
  }, [idsKey, token]);
};

export default useEstoqueWS;
