import { useMutation } from "@tanstack/react-query";
import type { Produto } from "../interfaces/Produto";
import { queryClient } from "../main";

const alterarProduto = async (produto: Produto): Promise<Produto> => {
  const response = await fetch("http://localhost:8080/produtos", {
    method: "PUT",
    headers: {
        "Content-type": "Application/json"
    },
    body: JSON.stringify(produto)
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao alterar um produto. Status code: " + response.status
    );
  }
  return await response.json();
};

const useAlterarProduto = () => {
  return useMutation({
    mutationFn: (produto: Produto) => alterarProduto(produto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
        exact: false
      })      
    }
  });
};
export default useAlterarProduto;
