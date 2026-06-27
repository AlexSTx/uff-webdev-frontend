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
}