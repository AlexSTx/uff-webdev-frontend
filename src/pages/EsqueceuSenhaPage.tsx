import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import type { InfoRedefinicaoSenha } from "../interfaces/InfoRedefinicaoSenha";
import type { RedefinirSenha } from "../interfaces/RedefinirSenha";
import useRedefinirSenha from "../hooks/autenticacao/useRedefinirSenha";

const schema = z
  .object({
    email: z.email("Informe um email válido."),
    novaSenha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
    confirmarSenha: z.string().nonempty("Confirme a senha."),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarSenha"],
  });

type FormEsqueceuSenha = z.infer<typeof schema>;

const EsqueceuSenhaPage = () => {
  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEsqueceuSenha>({ resolver: zodResolver(schema) });

  const { mutate: redefinirSenha, isPending } = useRedefinirSenha();

  const submit = ({ email, novaSenha }: FormEsqueceuSenha) => {
    setErro("");
    setSucesso("");
    const dados: RedefinirSenha = { email, novaSenha };
    redefinirSenha(dados, {
      onSuccess: (info: InfoRedefinicaoSenha) => {
        // O backend retorna HTTP 200 mesmo quando o email não existe; o
        // sucesso/erro de negócio vem nos campos de InfoRedefinicaoSenha.
        if (info.sucesso) {
          setSucesso(info.mensagem || "Senha redefinida com sucesso!");
          // Dá um instante para o usuário ver a confirmação antes de ir ao login.
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setErro(info.mensagem || "Não foi possível redefinir a senha.");
        }
      },
      onError: () => {
        setErro("Não foi possível redefinir a senha. Tente novamente mais tarde.");
      },
    });
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="w-full max-w-md space-y-6 card">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Redefinir senha
        </h2>
        <p className="text-center text-sm text-gray-500">
          Informe seu email e a nova senha.
        </p>

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
            <label className="label">Nova senha</label>
            <input
              {...register("novaSenha")}
              type="password"
              placeholder="Informe a nova senha"
              className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500 focus:border-gray-800"
            />
            {errors.novaSenha && (
              <p className="mt-1 text-sm font-semibold text-red-700">{errors.novaSenha.message}</p>
            )}
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input
              {...register("confirmarSenha")}
              type="password"
              placeholder="Repita a nova senha"
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
            {isPending ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link to="/login" className="text-orange-600 hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default EsqueceuSenhaPage;
