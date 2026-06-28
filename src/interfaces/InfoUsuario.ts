// Resposta do backend ao cadastrar um usuário (POST /usuarios).
// Sempre vem com HTTP 200: o sucesso/erro de negócio é indicado pelos campos.
export interface InfoUsuario {
  valido: boolean;
  duplicado: boolean;
  mensagem: string;
}
