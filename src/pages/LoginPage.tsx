import { useForm } from "react-hook-form";
import type { Usuario } from "../interfaces/Usuario";
import useUsuarioStore from "../store/UsuarioStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useEfetuarLogin from "../hooks/useEfetuarLogin";
import type { TokenResponse } from "../interfaces/TokenResponse";

interface LoginForm {
  conta: string;
  senha: string;
}

const LoginPage = () => {

  const setUsuarioLogado = useUsuarioStore((s) => s.setUsuarioLogado);
  const [loginInvalido, setLoginInvalido] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // const pessoa = {nome: "João Paulo", endereco: "Rua X n. 10"};
  // const empregado = {...pessoa, salario: 5000};  // spread
  // console.log(empregado);

  const {register, handleSubmit} = useForm<LoginForm>();

  const {mutate: efetuarLogin,
         error: errorEfetuarLogin} = useEfetuarLogin();

  useEffect(() => {
    setUsuarioLogado(0);
  }, [])

  const submit = ({conta, senha}: LoginForm) => {
    console.log(conta, senha);
    const usuario: Usuario = {conta, senha};
    efetuarLogin(usuario, {
      onSuccess: (tokenResponse: TokenResponse) => {
        if (tokenResponse.token) {
          setUsuarioLogado(tokenResponse.token);
          if (location.state?.destino) {
            navigate(location.state.destino);
          }
          else {
            navigate("/");
          }
        }
        else {
          setLoginInvalido(true);
        }
      }
    })
  }

  if (errorEfetuarLogin) throw errorEfetuarLogin;

  return (
    <>
      {/* Container queries - Como adaptar o tamanho dos filhos com base no tamanho dos pais.
          sm ≥ 640px
          md ≥ 768px
          lg ≥ 1024px
          xl ≥ 1280px
          2xl ≥ 1536px
          3xl (se customizado) ≥ 1600px (meu monitor não chega nem a 1500px, logo, não consigo testar) */}

      {/* pseudo elements */}
      <div className="mt-12 flex justify-center bg-white">
        {/* justify-center, centraliza a div abaixo no eixo principal (horizontal). 
            items-center, centraliza a div abaixo no eixo cruzado (vertical). */}
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl duration-300">
          {/* w-full: largura 100% do container. Sem w-full, a div fica com a largura 
          do conteudo. Com w-full, ela ocupa 100% do container ate o limite de max-w-md.
          max-w-md: limita a largura máxima (md ≈ 28rem / 448px).
          space-y-6: coloca espacamento vertical entre os filhos diretos (gap).
          rounded-2xl: cantos bem arredondados.
          bg-white: fundo branco.
          p-8: padding interno (2rem ou 32px).
          shadow-2xl: sombra forte.
          duration-300: transicoes duram 300ms (quando houver hover, focus, etc.). */}
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Informe sua Conta e Senha
          </h2>
          {loginInvalido && (
            <div className="mb-3 rounded border-2 border-red-600 bg-red-100 px-4 py-3 font-bold text-red-800">
              Login inválido.
            </div>
          )}	
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div>
              <label
                // htmlFor="conta"
                className="mb-1 block text-sm font-medium text-gray-700"
                // Sem block, o <label> é inline.
                // Se você colocar ambos (label e input) na mesma linha sem quebra (ou colocar
                // display: inline no input), o label e o input ficam lado a lado.

                // block - block faz o <label> virar elemento de bloco, então ele ocupa a linha
                // inteira e quebra linha antes/depois. Isso ajuda a manter o rótulo acima do input,
                // em vez de ficar na mesma linha.
              >
                Conta
              </label>
              <input
                {...register("conta")} // Adiciona ao input os aributos: onChange, onBlur, name e ref
                type="text"
                placeholder="Informe sua conta"
                // id="conta"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
            <div>
              <label
                // htmlFor="senha"
                // Usando hmlFor="senha" no label e id="senha" no input, ao passar o mouse sobre o label Senha
                // o input abaixo recebe uma borda. Não estou usando isso.
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                {...register("senha")}
                type="password"
                placeholder="Informe sua senha"
                // id="senha"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500"
              />
            </div>
            <div className="flex items-center justify-end">
              <a tabIndex={-1} href="#" className="text-green-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-green-600 py-2 font-semibold text-white duration-200 hover:bg-green-700"
            >
              Entrar
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            <span className="me-1">Não tem conta?</span>
            {/* A âncora tenta ficar na mesma linha - é um inline element */}
            <a href="#" className="text-green-600 hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
