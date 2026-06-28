import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Paginacao from "../components/Paginacao";
import Pesquisa from "../components/Pesquisa";
import TabelaDeProdutosPessimista from "../components/TabelaDeProdutosPessimista";
import useProdutoStore from "../store/ProdutoStore";

const ProdutosComPaginacaoPage = () => {
  const [searchParams] = useSearchParams();
  const setCategoriaId = useProdutoStore((s) => s.setCategoriaId);

  // Lê o query param ?categoria=X da URL (definido pelos cards da HomePage).
  // Se não existir, limpa o filtro (lista todas as categorias). Só atualiza
  // o store quando o valor muda — evita loop infinito de re-render.
  useEffect(() => {
    const cat = searchParams.get("categoria");
    const catId = cat ? Number(cat) : null;
    setCategoriaId(catId);
  }, [searchParams, setCategoriaId]);

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />

      <Pesquisa />
      <TabelaDeProdutosPessimista />
      <Paginacao />
    </>
  );
};
export default ProdutosComPaginacaoPage;
