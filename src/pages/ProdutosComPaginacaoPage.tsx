import { useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutosComPaginacao from "../hooks/useRecuperarProdutosComPaginacao";

const ProdutosComPaginacaoPage = () => {
  
  const [pagina, setPagina] = useState(0);
  const tamanho = 3;

  const {data: resultadoPaginado,
        isPending: recuperandoProdutos,
        error: errorRecuperarProdutos} = useRecuperarProdutosComPaginacao(pagina, tamanho);

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  const totalDePaginas = resultadoPaginado.totalDePaginas;
  const produtos = resultadoPaginado.itens;

  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
      <button onClick={() => setPagina(pagina-1)} disabled={pagina === 0} className="btn-success px-4 py-1 me-3">Anterior</button> 
      <button onClick={() => setPagina(pagina+1)} disabled={pagina === totalDePaginas - 1} className="btn-success px-4 py-1">Próxima</button> 
    </>
  )
}
export default ProdutosComPaginacaoPage