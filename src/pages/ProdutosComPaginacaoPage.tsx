import { useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";
import Paginacao from "../components/Paginacao";

const ProdutosComPaginacaoPage = () => {
  const [pagina, setPagina] = useState(0);
  const tamanho = 3;

  const tratarPaginacao = (pagina: number) => {
    setPagina(pagina);
  };

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
  });

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  const totalDePaginas = resultadoPaginado.totalDePaginas;
  const produtos = resultadoPaginado.itens;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
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

      {/* <button onClick={() => setPagina(pagina-1)} disabled={pagina === 0} className="btn-success px-4 py-1 me-3">Anterior</button> 
      <button onClick={() => setPagina(pagina+1)} disabled={pagina === totalDePaginas - 1} className="btn-success px-4 py-1">Próxima</button>  */}
    </>
  );
};
export default ProdutosComPaginacaoPage;
