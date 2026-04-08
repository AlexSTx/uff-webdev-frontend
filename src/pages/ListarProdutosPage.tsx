import TabelaDeProdutos from "../components/TabelaDeProdutos";
import recuperarProdutos from "../util/recuperarProdutos";

const ListarProdutosPage = () => {
  const produtos = recuperarProdutos();
  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  )
}
export default ListarProdutosPage