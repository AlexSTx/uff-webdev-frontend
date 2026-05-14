import { useState } from "react";
import Paginacao from "../components/Paginacao";
import Pesquisa from "../components/Pesquisa";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";
import useRemoverProduto from "../hooks/useRemoverProduto";

const ProdutosComPaginacaoPage = () => {
  const [pagina, setPagina] = useState(0);
  const [idRemovendo, setIdRemovendo] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const tamanho = 3;

  const tratarPaginacao = (pagina: number) => {
    setPagina(pagina);
  };

  const tratarPesquisa = (nome: string) => {
    setNome(nome);
  };

  const tratarRemocao = (id: number) => {
    removerProduto(id, {
      // a função definda em onSettled é executada após a função 
      // onSuccess. Ela resseta o valor de idRemovendo para null
      onSettled: () => setIdRemovendo(null)
    });
    setIdRemovendo(id);
    setPagina(0);
  }

  const {
    mutate: removerProduto,
    error: errorRemoverProduto } = useRemoverProduto();

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
      <TabelaDeProdutos produtos={produtos} tratarRemocao={tratarRemocao} idRemovendo={idRemovendo} />
      <div className="flex">
        <div className="flex flex-col items-center gap-2  ">
          <Paginacao
            pagina={pagina}
            totalDePaginas={totalDePaginas}
            tratarPaginacao={tratarPaginacao}
          />
          {/* O string "Atualizando..." só aparece se estivermos paginando os dados, isto é, 
          não irá aparecer se estivermos removendo um produto. Quando estamos removendo um 
          produto idRemovendo estará valendo o id do produto que está sendo removido. 
          E quando estivermos paginando idRemovendo estará valendo null */}
          {atualizandoProdutos && idRemovendo === null && (
            <span className="text-sm text-green-700">Atualizando...</span>
          )}
        </div>
      </div>
    </>
  );
};
export default ProdutosComPaginacaoPage;
