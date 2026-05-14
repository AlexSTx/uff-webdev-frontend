import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";

const removerProdutoPorId = async (id: number) => {
  // Acrescentei este timeout de 1 segundo para a remoção ficar mais lenta
  // e podermos ver na tela o efeito de uma remoção real que não acontecerá
  // instantaneamente.
  await new Promise<void>((resolve) => {
    setTimeout(() => {
        return resolve()
    }, 1000)
  })  

  const response = await fetch("http://localhost:8080/produtos/" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao remover produto. Status code: " + response.status,
    );
  }
  // return await response.json() - Não retorna nada uma vez que o back-end retorna void
};

const useRemoverProduto = () => {
  return useMutation({
    mutationFn: (id: number) => removerProdutoPorId(id),
    onSuccess: async () => {
      // invalidateQueries retorna uma Promise, logo, para tornar esse método mais 
      // síncrono utilizamos async / await. A função definida em onSettled é 
      // executada após a execução de onSuccess. Sem async/await ao se clicar no 
      // botão remover (de um produto), a função onSettled (definida em 
      // ProdutosComPaginacaoPage) é executada imediatamente e o botão "Removendo..." 
      // com o spinner irá piscar muito rápido. Com async / await, a função onSettled 
      // só será executada quando onSuccess terminar.   
      await queryClient.invalidateQueries({
        queryKey: ["produtos"],
      });
    },
  });
};
export default useRemoverProduto;