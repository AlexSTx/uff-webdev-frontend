import { useMutation } from "@tanstack/react-query";
import type { InfoRedefinicaoSenha } from "../../interfaces/InfoRedefinicaoSenha";
import type { RedefinirSenha } from "../../interfaces/RedefinirSenha";
import { URL_AUTENTICACAO, URL_BASE } from "../../util/constantes";

// Redefinição de senha simples (sem token/email). É público, então usamos
// fetch direto — mesmo padrão do login e do cadastro.
const useRedefinirSenha = () => {
  return useMutation({
    mutationFn: async (dados: RedefinirSenha): Promise<InfoRedefinicaoSenha> => {
      const response = await fetch(`${URL_BASE}${URL_AUTENTICACAO}/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(
          "Ocorreu um erro ao redefinir a senha. Status code: " + response.status,
        );
      }
      return await response.json();
    },
  });
};
export default useRedefinirSenha;
