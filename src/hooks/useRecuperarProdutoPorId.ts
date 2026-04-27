import { useQuery } from "@tanstack/react-query";

const recuperarProdutoPorId = async (id: number) => {
  // const num = await new Promise<number>((resolve) => {
  //   setTimeout(() => {
  //       return resolve(1)
  //   }, 1000)
  // })  
  // console.log(num);
  const response = await fetch("http://localhost:8080/produtos/" + id);
  if (!response.ok) {
    throw new Error(
      "Ocorreu um erro ao recuperar produto (" + id + "). Status: " + response.status,
    );
  }
  return await response.json();
};

const useRecuperarProdutoPorId = (id: number) => {
  return useQuery({
    queryKey: ["produtos", id],
    queryFn: () => recuperarProdutoPorId(id),
    // staleTime: 10_000,
  });
};
export default useRecuperarProdutoPorId;
