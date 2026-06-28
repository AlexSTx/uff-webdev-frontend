export const URL_BASE = "http://localhost:8080";

// Endpoint STOMP/WebSocket do backend. O token JWT viaja como query string
// aqui porque navegadores não permitem definir headers no handshake WS.
export const URL_WEBSOCKET = "ws://localhost:8080/ws";

export const URL_PRODUTOS = "/produtos";

export const URL_AUTENTICACAO = "/autenticacao";

export const URL_USUARIOS = "/usuarios";

export const URL_CARRINHO = "/carrinho";

export const URL_PEDIDOS = "/pedidos";