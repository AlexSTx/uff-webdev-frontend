import { useMutation } from "@tanstack/react-query";
import type { InfoUsuario } from "../../interfaces/InfoUsuario";
import type { UsuarioCreate } from "../../interfaces/UsuarioCreate";
import { URL_BASE, URL_USUARIOS } from "../../util/constantes";

// O cadastro é público (não exige token), então usamos fetch direto em vez
// de fetchWithAuth — mesmo padrão do useAPIAutenticacao para o login.
const useCadastrarUsuario = () => {
  return useMutation({
    mutationFn: async (usuario: UsuarioCreate): Promise<InfoUsuario> => {
      const response = await fetch(`${URL_BASE}${URL_USUARIOS}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) {
        throw new Error(
          "Ocorreu um erro ao cadastrar. Status code: " + response.status,
        );
      }
      return await response.json();
    },
  });
};
export default useCadastrarUsuario;
