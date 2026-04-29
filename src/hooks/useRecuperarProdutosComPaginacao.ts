import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";
import type { Produto } from "../interfaces/Produto";

const recuperarProdutosComPaginacao = async (pagina: number, tamanho: number): Promise<ResultadoPaginado<Produto>> => {
  const num = await new Promise<number>((resolve) => {
    setTimeout(() => {
        return resolve(1)
    }, 1000)
  })  
  // console.log(num);
  const response = await fetch(
    "http://localhost:8080/produtos/paginacao?pagina=" + pagina + "&tamanho="+ tamanho);
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos com paginação. Status: " + response.status,
    );
  }
  return await response.json();
};

const useRecuperarProdutosComPaginacao = (pagina: number, tamanho: number) => {
  return useQuery({
    queryKey: ["produtos", "paginacao", pagina, tamanho],
    queryFn: () => recuperarProdutosComPaginacao(pagina, tamanho),
    placeholderData: keepPreviousData
  });
};
export default useRecuperarProdutosComPaginacao;
