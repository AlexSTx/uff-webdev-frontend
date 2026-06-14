import { useMutation } from "@tanstack/react-query";
import type { Usuario } from "../interfaces/Usuario";
import useAPIAutenticacao from "./useAPIAutenticacao";

const useEfetuarLogin = () => {
  const { login } = useAPIAutenticacao();
  
  return useMutation({
    mutationFn: (usuario: Usuario) => login(usuario),
  });
};
export default useEfetuarLogin;
