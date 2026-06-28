export interface ItemCarrinho {
  id: number;
  produtoId: number;
  nome: string;
  descricao: string;
  imagem: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
  dataAdicao: string;
  // True quando o produto ainda tem estoque físico no momento do GET.
  // False quando esgotou desde a adição ao carrinho.
  disponivel: boolean;
  // Estoque físico atual do produto no momento do GET. Permite diferenciar
  // "esgotado" (0) de "quantidade parcial" (> 0 mas < quantidade no carrinho).
  estoqueDisponivel: number;
}