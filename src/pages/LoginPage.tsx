import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import z from "zod";
import type { TokenResponse } from "../interfaces/TokenResponse";
import type { UsuarioLogin } from "../interfaces/UsuarioLogin";
import useLoginStore from "../store/LoginStore";
import useTokenStore from "../store/TokenStore";
import isErrorResponse from "../util/isErrorResponse";
import useEfetuarLogin from "../hooks/autenticacao/useEfetuarLogin";
import useCarrinhoStore from "../store/CarrinhoStore";
import { URL_BASE, URL_CARRINHO } from "../util/constantes";
import { queryClient } from "../main";

const schema = z.object({
  email: z
    .email("Informe um email válido."),
  senha: z
    .string()
    .nonempty("Informe a senha.")
});

type FormLogin = z.infer<typeof schema>;

const LoginPage = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const setTokenResponse = useTokenStore((s) => s.setTokenResponse);
  const loginInvalido = useLoginStore((s) => s.loginInvalido);
  const setLoginInvalido = useLoginStore((s) => s.setLoginInvalido);
  const setMsg = useLoginStore((s) => s.setMsg);
  const msg = useLoginStore((s) => s.msg);

  const location = useLocation();
  const navigate = useNavigate();

  // Limpa mensagens de erro de login anteriores ao montar a página.
  // Antes daqui havia um setTokenResponse(...) que deslogava o usuário
  // incondicionalmente ao montar a LoginPage — isso fazia qualquer visita
  // (inclusive via NavBar "Sair" ou via redirect de rotas protegidas) logar
  // o usuário off. O logout agora é feito explicitamente pelo NavBar.
  useEffect(() => {
    setLoginInvalido(false);
    setMsg("");
  }, []);

  const { register, handleSubmit, formState: {errors} } = useForm<FormLogin>({resolver: zodResolver(schema)});
  const { mutate: efetuarLogin } = useEfetuarLogin();
  const limparCarrinhoConvidado = useCarrinhoStore((s) => s.limpar);

  // A página de login é fallback apenas para quem NÃO está logado.
  // Se um usuário autenticado cair aqui (ex.: digitou /login na barra de
  // endereço), redireciona para a home em vez de deslogar (como acontecia
  // antes) ou de mostrar o formulário.
  if (tokenResponse.idUsuario > 0) {
    return <Navigate to="/home" replace />;
  }

  const submit = ({ email, senha }: FormLogin) => {
    const usuarioLogin: UsuarioLogin = { email, senha };
    efetuarLogin(usuarioLogin, {
      onSuccess: async (tokenResp: TokenResponse) => {
        console.log("tokenResp = ", tokenResp);

        // Migra o carrinho de convidado (localStorage) para o banco de dados.
        // Lê o estado atual via getState() para evitar dependências de hook em callback.
        const itensConvidado = useCarrinhoStore.getState().itens;
        if (itensConvidado.length > 0) {
          try {
            await Promise.all(
              itensConvidado.map((i) =>
                fetch(`${URL_BASE}${URL_CARRINHO}`, {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${tokenResp.token}`,
                  },
                  body: JSON.stringify({
                    produtoId: i.produto.id,
                    quantidade: i.quantidade,
                  }),
                }),
              ),
            );
            limparCarrinhoConvidado();
            queryClient.invalidateQueries({ queryKey: ["carrinho"], exact: false });
          } catch (e) {
            console.error("Falha ao migrar carrinho de convidado:", e);
          }
        }

        setTokenResponse({
          idUsuario: tokenResp.idUsuario,
          token: tokenResp.token,
          nome: tokenResp.nome,
          role: tokenResp.role,
        });
        if (location.state?.destino) {
          navigate(location.state.destino);
        } else {
          navigate("/");
        }
      },
      onError: (error: any) => {
        if (isErrorResponse(error)) {
          setLoginInvalido(true);
          setMsg("Login inválido");
        } else {
          console.log("deu erro", error);
          // Aqui nunca irá ocorrer o erro 403 pois todos os usuários podem 
          // tentar efetuar login. Um erro 403 só ocorrerá quando um usuário
          // estive logado e tentar fazer algo sem possuir o respectivo Role.
          // *****************************************************************
          // *   Aqui estamos capturando o erro lançado em useEfetuarLogin   *
          // *****************************************************************
          if (error.message.includes("401")) {
            setLoginInvalido(true);
            setMsg("Email ou senha inválidos.");
          } else {
            setLoginInvalido(true);
            setMsg(
              "Não foi possível efetuar o login. Por favor, tente mais tarde."
            );
          }
        }
      },
    });
  };

  // if (errorEfetuarLogin) throw errorEfetuarLogin;

  return (
    <>
      {/* Container queries - Como adaptar o tamanho dos filhos com base no tamanho dos pais.
          sm ≥ 640px
          md ≥ 768px
          lg ≥ 1024px
          xl ≥ 1280px
          2xl ≥ 1536px
          3xl (se customizado) ≥ 1600px (meu monitor não chega nem a 1500px, logo, não consigo testar) */}

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-md space-y-6 card">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Informe seu Email e Senha
          </h2>
          {loginInvalido && (
            <div className="alert-error flex">
              <span>{msg}</span>
            </div>
          )}	
          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                {...register("email")}
                type="text"
                placeholder="Informe seu email"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.email && <p className="mt-1 text-sm font-semibold text-red-700">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Senha</label>
              <input
                {...register("senha")}
                type="password"
                placeholder="Informe sua senha"
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
              />
              {errors.senha && <p className="mt-1 text-sm font-semibold text-red-700">{errors.senha.message}</p>}
            </div>
            <div className="flex items-center justify-end">
              <Link to="/esqueceu-senha" className="text-sm text-orange-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-semibold text-white duration-200 hover:bg-orange-600"
            >
              Entrar
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            <span className="me-1">Não tem conta?</span>
            <Link to="/cadastro" className="text-orange-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
