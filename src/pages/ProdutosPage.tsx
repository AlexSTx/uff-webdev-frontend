import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";

const ProdutosPage = () => {

  const {data: produtos,
        isPending: recuperandoProdutos,
        error: errorRecuperarProdutos} = useRecuperarProdutos();

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  )
}
export default ProdutosPage