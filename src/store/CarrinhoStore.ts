import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Produto } from "../interfaces/Produto";

export interface ItemCarrinhoLocal {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoStore {
  itens: ItemCarrinhoLocal[];

  adicionarProduto: (produto: Produto, quantidade: number) => void;
  alterarQuantidade: (produtoId: number, quantidade: number) => void;
  removerProduto: (produtoId: number) => void;
  limpar: () => void;
}

const useCarrinhoStore = create<CarrinhoStore>()(
  persist(
    (set) => ({
      itens: [],

      adicionarProduto: (produto, quantidade) =>
        set((s) => {
          const existente = s.itens.find((i) => i.produto.id === produto.id);
          if (existente) {
            return {
              itens: s.itens.map((i) =>
                i.produto.id === produto.id
                  ? { ...i, quantidade: i.quantidade + quantidade }
                  : i,
              ),
            };
          }
          return { itens: [...s.itens, { produto, quantidade }] };
        }),

      alterarQuantidade: (produtoId, quantidade) =>
        set((s) => ({
          itens: s.itens
            .map((i) =>
              i.produto.id === produtoId
                ? { ...i, quantidade: Math.max(1, quantidade) }
                : i,
            )
            .filter((i) => i.quantidade > 0),
        })),

      removerProduto: (produtoId) =>
        set((s) => ({ itens: s.itens.filter((i) => i.produto.id !== produtoId) })),

      limpar: () => set(() => ({ itens: [] })),
    }),
    { name: "carrinho-convidado" },
  ),
);
export default useCarrinhoStore;