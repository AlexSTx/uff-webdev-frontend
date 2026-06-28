import { useForm } from "react-hook-form";
import databaseAdd from "../assets/skin/database_add.png";
import databaseEdit from "../assets/skin/database_edit.png";
import databaseCancel from "../assets/skin/multiply.png";
import type { Produto } from "../interfaces/Produto";
import useCadastrarProduto from "../hooks/produto/useCadastrarProduto";
import useProdutoStore from "../store/ProdutoStore";
import { useNavigate } from "react-router-dom";
import type { Categoria } from "../interfaces/Categoria";
import { useEffect } from "react";
import useAlterarProduto from "../hooks/produto/useAlterarProduto";
import z from "zod";
import isCategoriaValida from "../util/isCategoriaValida";
import { zodResolver } from "@hookform/resolvers/zod";

// interface FormProduto {
//   nome: string;
//   descricao: string;
//   categoria: number;
//   qtd_estoque: string;
//   data_cadastro: string;
//   preco: string;
//   imagem: string;
//   disponivel: boolean;
// }

const regexImagem = /^[a-z]+\.(gif|jpg|png|bmp)$/;
const schema = z.object({
  nome: z
    .string()
    .nonempty({ message: "O 'nome' deve ser informado." })
    .min(3, { message: "O 'nome' deve ter pelo menos 3 caracteres." }),
  descricao: z
    .string()
    .nonempty("A 'descrição' deve ser informada."),
  categoria: z
    .number()
    .refine(isCategoriaValida, {message: "A 'categoria' deve ser informada."}),
  preco: z
    .string()
    .nonempty("O preço deve ser informado")
    .refine((val) => +val > 0.10, {message: "O 'preço' deve ser > 0,10"}),
  qtd_estoque: z
    .string()
    .nonempty("A 'quantidade em estoque' deve ser informada"),
  imagem: z
    .string()
    .nonempty("A 'imagem' deve ser informada.")
    // Expressão regular só funciona se o tipo no zod for string
    // e no html o input for type="text".
    .regex(regexImagem, { message: "Nome de imagem inválido." }),
  disponivel: z.boolean(),
});

type FormProduto = z.infer<typeof schema>;

const ProdutoForm = () => {
  const setMensagem = useProdutoStore((s) => s.setMensagem);
  const produtoSelecionado = useProdutoStore((s) => s.produtoSelecionado);
  const navigate = useNavigate();

  const inicializarForm = () => {
    if (produtoSelecionado.id) {
      setValue("nome", produtoSelecionado.nome);
      setValue("descricao", produtoSelecionado.descricao);
      setValue("categoria", produtoSelecionado.categoria.id);
      setValue("qtd_estoque", produtoSelecionado.qtdEstoque!.toString());
      setValue("preco", produtoSelecionado.preco!.toString());
      setValue("imagem", produtoSelecionado.imagem);
      setValue("disponivel", produtoSelecionado.disponivel);
    } else {
      reset();
    }
  }

  useEffect(() => {
    inicializarForm();
  }, [produtoSelecionado])

  const {mutate: cadastrarProduto, error: errorCadastrarProduto} = useCadastrarProduto();
  const {mutate: alterarProduto, error: errorAlterarProduto} = useAlterarProduto();

  const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm<FormProduto>({resolver: zodResolver(schema)});
  const submit = ({nome, descricao, categoria,
                   preco, qtd_estoque,
                   imagem, disponivel}: FormProduto) => {
    const produto: Produto = {
        nome: nome,
        descricao: descricao,
        categoria: {id: categoria} as Categoria,
        qtdEstoque: qtd_estoque ? +qtd_estoque : null,
        // A data de cadastro é definida/controle do backend; o cliente nunca a envia.
        dataCadastro: null,
        preco: preco ? +preco : null,
        imagem: imagem,
        disponivel: disponivel
    }
    if(produtoSelecionado.id) {
      produto.id = produtoSelecionado.id;
      alterarProduto(produto, {
          onSuccess: (produto: Produto) => {
              setMensagem("Produto alterado com sucesso.");
              navigate("/produtos/" + produto.id);
          }
        });
      } else {
        cadastrarProduto(produto, {
          onSuccess: (produto: Produto) => {
            setMensagem("Produto cadastrado com sucesso.");
            navigate("/produtos/" + produto.id);
          }
        });
      }
    }

    if (errorCadastrarProduto) throw errorCadastrarProduto;
    if (errorAlterarProduto) throw errorAlterarProduto;
    
  return (
    <form onSubmit={handleSubmit(submit)} className="card mt-4" autoComplete="off">
      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Nome
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("nome")}
                type="text"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.nome && <p className="mt-1 text-sm font-semibold text-red-700">{errors.nome.message}</p>}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Descrição
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("descricao")}
                type="text"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.descricao && <p className="mt-1 text-sm font-semibold text-red-700">{errors.descricao.message}</p>}
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Categoria
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <select
                {...register("categoria", { valueAsNumber: true })}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              >
                <option value="0">Selecione uma categoria</option>
                <option value="1">Processador</option>
                <option value="2">Placa de Vídeo</option>
                <option value="3">Memória RAM</option>
              </select>
              {errors.categoria && <p className="mt-1 text-sm font-semibold text-red-700">{errors.categoria.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Preço
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("preco")}
                type="number"
                step="0.01"
                min="0.10"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.preco && <p className="mt-1 text-sm font-semibold text-red-700">{errors.preco.message}</p>}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Estoque
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("qtd_estoque")}
                type="number"
                min="0"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.qtd_estoque && <p className="mt-1 text-sm font-semibold text-red-700">{errors.qtd_estoque.message}</p>}
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 lg:gap-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <label className="col-span-12 lg:col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
              Imagem
            </label>
            <div className="col-span-12 lg:col-span-9 xl:col-span-10">
              <input
                {...register("imagem")}
                type="text"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.imagem && <p className="mt-1 text-sm font-semibold text-red-700">{errors.imagem.message}</p>}
            </div>
          </div>
        </div>  

        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <div className="flex items-center col-span-9 lg:col-start-4 xl:col-start-3">
              <input
                {...register("disponivel")}
                type="checkbox"
                className="form-checkbox mr-2 h-4 w-4 text-blue-600"
              />
              <label className="col-span-3 xl:col-span-2 mb-1 flex items-center font-bold text-gray-700">
                Disponível?
              </label>
            </div>
          </div>
        </div>  
      </div>

      <div className="grid grid-cols-12 gap-1 mb-6">
        <div className="col-span-12 lg:col-span-6 mb-1 lg:mb-3">
          <div className="grid grid-cols-12">
            <div className="flex col-span-12 lg:col-start-4 xl:col-start-3">
              <button type="submit"
                className="flex justify-center items-center btn-success px-5 py-1.5 me-4">
                  {produtoSelecionado.id ? 
                    <>
                      <img src={databaseEdit} className="me-2" /> Alterar
                    </> : 
                    <>
                      <img src={databaseAdd} className="me-2" /> Cadastrar
                    </>
                  }
              </button>
              <button type="button" onClick={() => inicializarForm()}
                className="flex justify-center items-center btn-secondary px-5 py-1.5">
                  <img src={databaseCancel} className="me-2" /> Cancelar
              </button>
            </div>
          </div>
        </div>  
      </div>

    </form>
  )
}
export default ProdutoForm