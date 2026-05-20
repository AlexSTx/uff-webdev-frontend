import { create } from "zustand";

interface ProdutoStore {
    pagina: number;
    tamanho: number;
    nome: string;   
    idRemovendo: number | null;

    setPagina: (novaPagina: number) => void;
    setNome: (novoNome: string) => void;
    setIdRemovendo: (novoIdRemovendo: number | null) => void;
}

const useProdutoStore = create<ProdutoStore>((set) => ({
    pagina: 0,
    tamanho: 5,
    nome: "",
    idRemovendo: null,
    
    setPagina: (novaPagina: number) => set((s) => ({pagina: novaPagina, tamanho: s.tamanho, nome: s.nome})),
    setNome:  (novoNome: string) => set(() => ({nome: novoNome})),
    setIdRemovendo:  (novoIdRemovendo: number | null) => set(() => ({idRemovendo: novoIdRemovendo}))
}))
export default useProdutoStore