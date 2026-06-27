import { create } from "zustand";
import type { Produto } from "../interfaces/Produto";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoStore {
  itens: ItemCarrinho[];

  adicionarProduto: (produto: Produto, quantidade: number) => void;
  removerProduto: (idProduto: number) => void;
  alterarQuantidade: (idProduto: number, novaQuantidade: number) => void;
  limpar: () => void;
}

const useCarrinhoStore = create<CarrinhoStore>((set) => ({
  itens: [],

  adicionarProduto: (produto, quantidade) =>
    set((s) => {
      const id = produto.id;
      const existente = s.itens.find((i) => i.produto.id === id);
      if (existente) {
        return {
          itens: s.itens.map((i) =>
            i.produto.id === id
              ? { ...i, quantidade: i.quantidade + quantidade }
              : i,
          ),
        };
      }
      return { itens: [...s.itens, { produto, quantidade }] };
    }),

  removerProduto: (idProduto) =>
    set((s) => ({ itens: s.itens.filter((i) => i.produto.id !== idProduto) })),

  alterarQuantidade: (idProduto, novaQuantidade) =>
    set((s) => ({
      itens: s.itens
        .map((i) =>
          i.produto.id === idProduto
            ? { ...i, quantidade: Math.max(1, novaQuantidade) }
            : i,
        )
        .filter((i) => i.quantidade > 0),
    })),

  limpar: () => set(() => ({ itens: [] })),
}));

export default useCarrinhoStore;