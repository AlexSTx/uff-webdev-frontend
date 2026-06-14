import type { ResultadoPaginado } from "../interfaces/ResultadoPaginado";
import { URL_BASE } from "../util/constantes";
import isErrorResponse from "../util/isErrorResponse";

const useAPI = <T>(endpoint: string) => {
  const URL = `${URL_BASE}${endpoint}`;

  const recuperar = async (): Promise<T[]> => {
    const response = await fetch(URL);
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo GET para " + URL_BASE + endpoint + ". Status: " + response.status,
      );
    }
    return await response.json();
  };

  const cadastrar = async (obj: T): Promise<T> => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo POST para " + URL_BASE + endpoint + ". Status: " + response.status,
      );
    }
    return await response.json();
  }

  const alterar = async (obj: T): Promise<T> => {
    const response = await fetch(URL, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo PUT para " + URL_BASE + endpoint + ". Status: " + response.status,
      );
    }
    return await response.json();
  }

  const recuperarPorId = async (id: number): Promise<T> => {
    const response = await fetch(URL + "/" + id);
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo GET para "
          + URL_BASE + endpoint + "/" + id + ". Status: " + response.status
      );
    }
    return await response.json();
  };

  const removerPorId = async (id: number): Promise<void> => {
    const response = await fetch(URL + "/" + id, {
        method: "DELETE"
    });
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo DELETE para "
          + URL_BASE + endpoint + "/" + id + ". Status: " + response.status
      );
    }
    // return await response.json();
  };

  const recuperarComPaginacao = async (queryString: Record<string, string>): Promise<ResultadoPaginado<T>> => {
    const response = await fetch(URL + "/paginacao?" + new URLSearchParams(queryString));
    if (!response.ok) {
      const error: any = await response.json();
      if (isErrorResponse(error)) {
        throw error;
      }  
      throw new Error(
        "Ocorreu um erro ao enviar uma requisição do tipo GET com paginação para " + URL_BASE + endpoint + ". Status: " + response.status,
      );
    }
    return await response.json();
  };

  return { recuperar, cadastrar, alterar, recuperarPorId, removerPorId, recuperarComPaginacao };
};
export default useAPI;
