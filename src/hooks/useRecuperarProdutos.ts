import { useQuery } from "@tanstack/react-query";

const recuperarProdutos = async () => {
  const num = await new Promise<number>((resolve) => {
    setTimeout(() => {
        return resolve(1)
    }, 1000)
  })  
  console.log(num);
  const response = await fetch("http://localhost:8080/produtos");
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produtos. Status: " + response.status,
    );
  }
  return await response.json();
};

const useRecuperarProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: recuperarProdutos,
    staleTime: 10_000,
  });
};
export default useRecuperarProdutos;
