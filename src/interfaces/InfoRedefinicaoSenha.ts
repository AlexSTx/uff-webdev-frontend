// Resposta do backend ao redefinir a senha (POST /autenticacao/redefinir-senha).
// Vem com HTTP 200: o sucesso/erro de negócio é indicado pelos campos.
export interface InfoRedefinicaoSenha {
  sucesso: boolean;
  mensagem: string;
}
