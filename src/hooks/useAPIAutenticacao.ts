import type { Usuario } from "../interfaces/Usuario";
import { URL_AUTENTICACAO, URL_BASE } from "../util/constantes";

const useAPIAutenticacao = () => {
  const URL = URL_BASE + URL_AUTENTICACAO;  
  const login = async (usuario: Usuario) => {
    const response = await fetch(URL + "/login", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error(
        "Ocorreu um erro ao efetuar login. Status code: " + response.status,
      );
    }
    return await response.json();
  };

  return { login };
};
export default useAPIAutenticacao;
