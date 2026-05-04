import { useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";
import Paginacao from "../components/Paginacao";
import Pesquisa from "../components/Pesquisa";
import { useMutation } from "@tanstack/react-query";

const ProdutosComPaginacaoPage = () => {
  const [pagina, setPagina] = useState(0);
  const [nome, setNome] = useState("");
  const tamanho = 3;

  const tratarPaginacao = (pagina: number) => {
    setPagina(pagina);
  };

  const tratarPesquisa = (nome: string) => {
    setNome(nome);
  };

  const tratarRemocao = (id: number) => {
    removerProduto(id);
    setPagina(0);
  }

  const removerProdutoPorId = async (id: number) => {
    const response = await fetch("http://localhost:8080/produto/" + id, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error ("Ocorreu um erro ao remover produto. Status code: " + response.status);
    }
    // return await response.json() - Não retorna nada uma vez que o back-end retorna void
  }
  const {
    mutate: removerProduto,
    error: errorRemoverProduto
  } = useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id),

  })
  // isPending fica true quando não há dados ainda (primeira carga da query).
  
  // isFetching fica true sempre que há uma busca em andamento, inclusive na primeira carga 
  // e nas refetches/trocas de página.

  const {
    data: resultadoPaginado,
    isPending: recuperandoProdutos,
    isFetching: atualizandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutosComPaginacao({
    pagina: pagina.toString(),
    tamanho: tamanho.toString(),
    nome: nome
  });

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (errorRemoverProduto) throw errorRemoverProduto;
  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  const totalDePaginas = resultadoPaginado.totalDePaginas;
  const produtos = resultadoPaginado.itens;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />

      <Pesquisa tratarPesquisa={tratarPesquisa} />
      <TabelaDeProdutos produtos={produtos} tratarRemocao={tratarRemocao} />
      <div className="flex">
        <div className="flex flex-col items-center gap-2  ">
          <Paginacao
            pagina={pagina}
            totalDePaginas={totalDePaginas}
            tratarPaginacao={tratarPaginacao}
          />
          {atualizandoProdutos && (
            <span className="text-sm text-green-700">Atualizando...</span>
          )}
        </div>
      </div>
    </>
  );
};
export default ProdutosComPaginacaoPage;
