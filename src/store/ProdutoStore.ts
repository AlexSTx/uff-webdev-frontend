import { create } from "zustand";
import type { Produto } from "../interfaces/Produto";

interface ProdutoStore {
    pagina: number;
    tamanho: number;
    nome: string;
    // Filtro opcional de categoria. Vem da query string da URL (?categoria=2).
    // Quando null, lista todas as categorias.
    categoriaId: number | null;
    idRemovendo: number | null;
    mensagem: string;
    produtoSelecionado: Produto;

    setPagina: (novaPagina: number) => void;
    setNome: (novoNome: string) => void;
    setCategoriaId: (novaCategoriaId: number | null) => void;
    setIdRemovendo: (novoIdRemovendo: number | null) => void;
    setMensagem: (novaMensagem: string) => void;
    setProdutoSelecionado: (novoProdutoSelecionado: Produto) => void;
}

const useProdutoStore = create<ProdutoStore>((set) => ({
    pagina: 0,
    tamanho: 5,
    nome: "",
    categoriaId: null,
    idRemovendo: null,
    mensagem: "",
    produtoSelecionado: {} as Produto,

    setPagina: (novaPagina: number) => set((s) => ({pagina: novaPagina, tamanho: s.tamanho, nome: s.nome, categoriaId: s.categoriaId})),
    setNome:  (novoNome: string) => set(() => ({nome: novoNome, pagina: 0})),
    setCategoriaId:  (novaCategoriaId: number | null) => set(() => ({categoriaId: novaCategoriaId, pagina: 0})),
    setIdRemovendo:  (novoIdRemovendo: number | null) => set(() => ({idRemovendo: novoIdRemovendo})),
    setMensagem:  (novaMensagem: string) => set(() => ({mensagem: novaMensagem})),
    setProdutoSelecionado: (novoProdutoSelecionado: Produto) =>
        set(() => ({produtoSelecionado: novoProdutoSelecionado}))
}))
export default useProdutoStore