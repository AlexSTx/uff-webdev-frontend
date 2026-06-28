import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TokenResponse } from "../interfaces/TokenResponse";

interface TokenStore{
    tokenResponse: TokenResponse;
    setTokenResponse: (novoTokenResponse: TokenResponse) => void;
}

// Persistido em localStorage para que a sessão sobreviva a recarregamentos
// (ex.: colar uma URL de /pagamento/:id na barra de endereço). Sem isso, o
// estado em memória era zerado a cada reload e o usuário "perdia" o login.
const useTokenStore = create<TokenStore>()(
    persist(
        (set) => ({
            tokenResponse: {token: "", idUsuario: 0, nome: "", role: ""},
            setTokenResponse: (novoTokenResponse: TokenResponse) => set(() => ({tokenResponse: novoTokenResponse})),
        }),
        { name: "token-usuario" },
    ),
)
export default useTokenStore;
