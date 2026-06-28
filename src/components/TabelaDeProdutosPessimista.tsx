import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import databaseDelete from '../assets/skin/database_delete.png';
import useRecuperarProdutosComPaginacao from "../hooks/produto/useRecuperarProdutosComPaginacao";
import useRemoverProduto from "../hooks/produto/useRemoverProduto";
import useAdicionarItemCarrinho from "../hooks/carrinho/useAdicionarItemCarrinho";
import useProdutoStore from "../store/ProdutoStore";
import useTokenStore from "../store/TokenStore";

const TabelaDeProdutosPessimista = () => {
  const role = useTokenStore((s) => s.tokenResponse.role);
  const pagina = useProdutoStore((s) => s.pagina);
  const tamanho = useProdutoStore((s) => s.tamanho);
  const nome = useProdutoStore((s) => s.nome);
  const categoriaId = useProdutoStore((s) => s.categoriaId);
  const idRemovendo = useProdutoStore((s) => s.idRemovendo);

  const setPagina = useProdutoStore((s) => s.setPagina);
  const setIdRemovendo = useProdutoStore((s) => s.setIdRemovendo);

  // Mensagem de confirmação ao adicionar um produto ao carrinho.
  // Estado puramente local ao componente — não afeta carrinho/store nem
  // é compartilhado com a página. Usa o mesmo padrão visual (.alert-info)
  // já visto no ProdutoPage para manter a consistência.
  const [msgCarrinho, setMsgCarrinho] = useState("");
  
  const tratarRemocao = (id: number) => {
    removerProduto(id, {
      onSettled: () => {
        setIdRemovendo(null);
        setPagina(0);
      }
    });
    setIdRemovendo(id);
  }

  const {
    mutate: removerProduto,
    error: errorRemoverProduto} = useRemoverProduto();

  const { mutate: adicionarItem, isPending: adicionandoItem } = useAdicionarItemCarrinho();

  const {
    data: resultadoPaginado,
    isPending: recuperandoProdutos,
    // isFetching: atualizandoProdutos,
    error: errorRecuperarProdutos,
  } = useRecuperarProdutosComPaginacao({
    pagina: pagina.toString(),
    tamanho: tamanho.toString(),
    nome: nome,
    ...(categoriaId !== null ? { categoriaId: categoriaId.toString() } : {}),
  });

  if (errorRecuperarProdutos) throw errorRecuperarProdutos;
  if (errorRemoverProduto) throw errorRemoverProduto;
  if (recuperandoProdutos) return <p className="text-lg">Recuperando produtos...</p>;

  const produtos = resultadoPaginado.itens;

  return (
    <>
      {/* Confirmação de item adicionado ao carrinho — pisca acima da tabela
          e some quando o usuário muda de página ou adiciona outro. */}
      {msgCarrinho && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-md border-2 border-orange-500 bg-orange-50 px-4 py-3 text-orange-800">
          <span className="font-semibold">
            <i className="bi bi-check-circle-fill me-2 text-orange-600"></i>
            {msgCarrinho}
          </span>
          <Link to="/carrinho" className="btn-primary px-4 py-1.5 text-sm">
            <i className="bi bi-cart3 me-1"></i>
            Ir para o carrinho
          </Link>
        </div>
      )}

      <div className="overflow-x-auto mb-3">
        <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-200">
            <th className="p-2 font-semibold">Id</th>
            <th className="p-2 font-semibold">Imagem</th>
            <th className="p-2 font-semibold">Categoria</th>
            <th className="p-2 font-semibold">Nome</th>
            <th className="p-2 font-semibold">Disponível</th>
            <th className="p-2 font-semibold">Data de Cadastro</th>
            <th className="p-2 font-semibold">Preço</th>
            <th className="p-2 font-semibold">Ação</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={produto.id} className={"border-b border-gray-200 transition hover:bg-orange-50 " + (index % 2 === 0 ? "bg-white" : "bg-gray-50")}>
              <td className="text-center p-2 w-[8%]">{produto.id}</td>
              <td className="text-center p-2 w-[10%]">
                <div className="flex justify-center">
                  <img src={produto.imagem} width="40px" />
                </div>
              </td>
              <td className="text-center p-2 w-[13%]">{produto.categoria.nome}</td>
              <td className="ps-2 p-2 w-[20%]">
                <Link className="font-bold text-orange-600 hover:underline" to={"/produtos/" + produto.id}>{produto.nome}</Link> 
              </td>
              <td className="text-center p-2 w-[13%]">{produto.disponivel ? "Sim" : "Não"}</td>
              <td className="text-center p-2 w-[13%]">{dayjs(produto.dataCadastro).format("DD/MM/YYYY")}</td>
              <td className="text-end pe-2 p-2 w-[10%]">{produto.preco!.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
              })}</td>
              <td className="text-center p-2 w-[13%]">
                {role === "ADMIN" ? (
                  <button onClick={() => tratarRemocao(produto.id!)} className="btn-danger px-4 py-1" type="button">
                    <div className="flex items-center">
                      {idRemovendo === produto.id ?
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent me-2" />
                        Removendo...
                      </> :
                      <>
                        <img className="me-1" src={databaseDelete} />
                        Remover
                      </>}
                     </div>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      adicionarItem(
                        { produto, quantidade: 1 },
                        {
                          onSuccess: () =>
                            setMsgCarrinho(`${produto.nome} adicionado ao carrinho!`),
                          onError: () => setMsgCarrinho(""),
                        },
                      )
                    }
                    disabled={adicionandoItem || !produto.disponivel}
                    className="btn-primary px-4 py-1"
                    type="button"
                  >
                    <div className="flex items-center">
                      <i className="bi bi-cart-plus me-1"></i>
                      Comprar
                    </div>
                  </button>
                )}
              </td>
            </tr>
))}
         </tbody>
       </table>
     </div>
    </>
  );
};
export default TabelaDeProdutosPessimista;
