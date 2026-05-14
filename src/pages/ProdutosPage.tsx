import TabelaDeProdutos from "../components/TabelaDeProdutos";
import useRecuperarProdutos from "../hooks/useRecuperarProdutos";
import useRemoverProdutoOtimista from "../hooks/useRemoverProdutoOtimista";

const ProdutosPage = () => {
  const {
    data: produtos,
    isPending: recuperandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutos();

  const tratarRemocao = (id: number) => {
    removerProduto(id);
  };

  const { mutate: removerProduto,
       // error: errorRemoverProduto  <== Isso não pode existir com remoção otimista
       // caso contrário a página de erro será exibida. Veja abaixo.
  } = useRemoverProdutoOtimista();

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;

  // Ao utiizar a remoção otimista errorRemoverProduto não deve ser utilizado para que a 
  // página de erro não seja exibida.
  // if (errorRemoverProduto) throw errorRemoverProduto;

  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} tratarRemocao={tratarRemocao}/>
    </>
  );
};
export default ProdutosPage;