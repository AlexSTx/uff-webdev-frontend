import type { ItemPedido } from "./ItemPedido";

export type StatusPedido =
  | "PENDENTE"
  | "PAGO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

export type FormaPagamento =
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "PIX"
  | "BOLETO";

export interface Pedido {
  id: number;
  dataPedido: string;
  valorTotal: number;
  status: StatusPedido;
  formaPagamento: FormaPagamento;
  itens: ItemPedido[];
}
