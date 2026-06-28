import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import z from "zod";
import type { InfoUsuario } from "../interfaces/InfoUsuario";
import type { UsuarioCreate } from "../interfaces/UsuarioCreate";
import useCadastrarUsuario from "../hooks/autenticacao/useCadastrarUsuario";
import useTokenStore from "../store/TokenStore";

const schema = z
  .object({
    nome: z.string().nonempty("Informe seu nome."),
    email: z.email("Informe um email válido."),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
    confirmarSenha: z.string().nonempty("Confirme a senha."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarSenha"],
  });

type FormCadastro = z.infer<typeof schema>;

const CadastroPage = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormCadastro>({ resolver: zodResolver(schema) });

  const { mutate: cadastrarUsuario, isPending } = useCadastrarUsuario();

  // Quem já está logado não precisa se cadastrar.
  if (tokenResponse.idUsuario > 0) {
    return <Navigate to="/home" replace />;
  }

  const submit = ({ nome, email, senha }: FormCadastro) => {
    setErro("");
    setSucesso("");
    const usuario: UsuarioCreate = { nome, email, senha };
    cadastrarUsuario(usuario, {
      onSuccess: (info: InfoUsuario) => {
        // O backend retorna HTTP 200 mesmo quando o email já existe; o
        // sucesso/erro de negócio vem nos campos de InfoUsuario.
        if (info.valido) {
          setSucesso(info.mensagem || "Cadastro realizado com sucesso!");
          // Dá um instante para o usuário ver a confirmação antes de ir ao login.
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setErro(info.mensagem || "Não foi possível concluir o cadastro.");
        }
      },
      onError: () => {
        setErro("Não foi possível concluir o cadastro. Tente novamente mais tarde.");
      },
    });
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="w-full max-w-md space-y-6 card">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Crie sua conta
        </h2>

        {erro && (
          <div className="alert-error flex">
            <span>{erro}</span>
          </div>
        )}
        {sucesso && (
          <div className="alert-success">
            <span>{sucesso}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div>
            <label className="label">Nome</label>
            <input
              {...register("nome")}
              type="text"
              placeholder="Informe seu nome"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
            />
            {errors.nome && (
              <p className="mt-1 text-sm font-semibold text-red-700">{errors.nome.message}</p>
            )}
          </div>
          <div>
            <label className="label">Email</label>
            <input
              {...register("email")}
              type="text"
              placeholder="Informe seu email"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
            />
            {errors.email && (
              <p className="mt-1 text-sm font-semibold text-red-700">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              {...register("senha")}
              type="password"
              placeholder="Informe sua senha"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
            />
            {errors.senha && (
              <p className="mt-1 text-sm font-semibold text-red-700">{errors.senha.message}</p>
            )}
          </div>
          <div>
            <label className="label">Confirmar senha</label>
            <input
              {...register("confirmarSenha")}
              type="password"
              placeholder="Repita sua senha"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
            />
            {errors.confirmarSenha && (
              <p className="mt-1 text-sm font-semibold text-red-700">{errors.confirmarSenha.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-semibold text-white duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <span className="me-1">Já tem conta?</span>
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-orange-600 hover:underline"
          >
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
};
export default CadastroPage;
