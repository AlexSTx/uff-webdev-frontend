import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Produto } from "../interfaces/Produto";
import useProdutoStore from "../store/ProdutoStore";
import useTokenStore from "../store/TokenStore";
import useRecuperarProdutoPorId from "../hooks/produto/useRecuperarProdutoPorId";
import useRemoverProduto from "../hooks/produto/useRemoverProduto";
import useAdicionarItemCarrinho from "../hooks/carrinho/useAdicionarItemCarrinho";
import useEstoqueProdutoWS from "../hooks/produto/useEstoqueProdutoWS";
import isErrorResponse from "../util/isErrorResponse";

const ProdutoPage = () => {
  const [removido, setRemovido] = useState(false);
  const [qtdCarrinho, setQtdCarrinho] = useState(1);
  const [msgCarrinho, setMsgCarrinho] = useState("");
  const mensagem = useProdutoStore((s) => s.mensagem);
  const setMensagem = useProdutoStore((s) => s.setMensagem);
  const setProdutoSelecionado = useProdutoStore((s) => s.setProdutoSelecionado);
  const role = useTokenStore((s) => s.tokenResponse.role);
  const navigate = useNavigate();
  
  const { id } = useParams();

  const {
    data: produto,
    isPending: recuperandoProduto,
    error: errorRecuperarProduto,
  } = useRecuperarProdutoPorId(+id!, removido);

  // Assina o WebSocket do produto para receber a notificação de estoque
  // esgotado em tempo real e refletir imediatamente na UI.
  useEstoqueProdutoWS(+id!);

  const tratarEdicao = (produto: Produto) => {
    setProdutoSelecionado(produto);
    navigate("/cadastrar-produto");
  };

  const tratarRemocao = (id: number) => {
    removerProduto(id);
    setRemovido(true);
    setMensagem("Produto removido com sucesso!");
  };

  const { mutate: removerProduto,
          error: errorRemoverProduto } = useRemoverProduto();

  const { mutate: adicionarItem, isPending: adicionandoItem, error: erroAdicao } = useAdicionarItemCarrinho();

  const esgotado = (produto?.qtdEstoque ?? 0) <= 0;

  const tratarAdicionarCarrinho = () => {
    adicionarItem(
      { produto: produto!, quantidade: qtdCarrinho },
      {
        onSuccess: () =>
          setMsgCarrinho(
            `${qtdCarrinho} × ${produto!.nome} adicionado(s) ao carrinho.`,
          ),
        // Limpa um erro anterior ao iniciar nova tentativa.
        onError: () => setMsgCarrinho(""),
      },
    );
  };

  useEffect(() => {

    return () => {
      setMensagem("");
    }
  }, [setMensagem])

  if (errorRecuperarProduto) throw errorRecuperarProduto;
  if (errorRemoverProduto) throw errorRemoverProduto;
  if (recuperandoProduto)
    return <p className="text-lg">Recuperando produto...</p>;

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold">Página de Produto</h1>
      <hr className="mb-4" />

      {mensagem && (
        <div className="alert-success">
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <img className="lg:hidden rounded-lg shadow" src={"/" + produto.imagem} width="170px" />
          <img
            className="hidden lg:block rounded-lg shadow"
            src={"/" + produto.imagem}
            width="210px"
          />
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-12 gap-y-2">
            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Categoria
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.categoria.nome}
            </div>

            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Nome
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.nome} ({produto.descricao})
            </div>

            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Preço
            </div>
            <div className="col-span-8 text-lg font-semibold text-orange-600 lg:col-span-9 xl:col-span-10">
              {produto.preco!.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })}
            </div>

            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Estoque
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.qtdEstoque}
            </div>

            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Data Cadastro
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {dayjs(produto.dataCadastro).format("DD/MM/YYYY")}
            </div>

            <div className="col-span-4 font-bold text-gray-700 lg:col-span-3 xl:col-span-2">
              Disponível
            </div>
            <div className="col-span-8 lg:col-span-9 xl:col-span-10">
              {produto.disponivel ? "Sim" : "Não"}
            </div>
          </div>
        </div>
        {msgCarrinho && (
          <div className="col-span-12 alert-info">
            {msgCarrinho}
          </div>
        )}

        {erroAdicao && (
          <div className="col-span-12 alert-error" role="alert">
            <i className="bi bi-x-octagon-fill mt-0.5"></i>
            <div>
              <p className="font-semibold">
                {isErrorResponse(erroAdicao) && erroAdicao.errorCode === 409
                  ? "Não foi possível adicionar ao carrinho: estoque insuficiente."
                  : "Não foi possível adicionar ao carrinho."}
              </p>
              {isErrorResponse(erroAdicao) &&
                Object.keys(erroAdicao.map || {}).length > 0 && (
                  <ul className="mt-1 list-inside list-disc text-sm">
                    {Object.values(erroAdicao.map).map((descr) => {
                      const m = descr.match(
                        /^(?<nome>[^:]+):\s*pedido=(?<ped>\d+),\s*disponivel=(?<disp>\d+)$/,
                      );
                      if (m?.groups) {
                        const { nome, ped, disp } = m.groups;
                        return (
                          <li key={descr}>
                            {nome} — pedido: {ped}, disponível: {disp}
                          </li>
                        );
                      }
                      return <li key={descr}>{descr}</li>;
                    })}
                  </ul>
                )}
            </div>
          </div>
        )}

        <div className="col-span-12 mb-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col">
            <span className="mb-1 font-bold text-gray-700">Quantidade</span>
            <input
              type="number"
              min={1}
              max={produto.qtdEstoque ?? undefined}
              value={qtdCarrinho}
              onChange={(e) => {
                const v = Number(e.target.value);
                const limite = produto.qtdEstoque ?? Number.POSITIVE_INFINITY;
                setQtdCarrinho(Math.min(Math.max(1, v), limite));
              }}
              disabled={esgotado}
              className="w-24 rounded-md border-2 border-gray-300 px-2 py-1.5 outline-none hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          <button
            onClick={tratarAdicionarCarrinho}
            disabled={removido || !produto.disponivel || esgotado || adicionandoItem}
            className="btn-primary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400"
            type="button"
          >
            <i className="bi bi-cart-plus me-1"></i>
            {esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
          </button>
        </div>

        {role === "ADMIN" && (
          <div className="col-span-12 flex gap-3">
            <div className="w-1/2 lg:w-1/4 xl:w-1/6">
              <button
                onClick={() => tratarEdicao(produto)}
                disabled={removido}
                className="btn-success w-full py-1.5"
                type="button"
              >
                Editar
              </button>
            </div>
            <div className="w-1/2 lg:w-1/4 xl:w-1/6">
              <button
                onClick={() => tratarRemocao(produto.id!)}
                disabled={removido}
                className="btn-danger w-full py-1.5"
                type="button"
              >
                Remover
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProdutoPage;
