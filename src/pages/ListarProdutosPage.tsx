import { useEffect, useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";

const ListarProdutosPage = () => {

  console.log("1, 10");

  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  console.log("2, 11");

  useEffect(() => {
    console.log("5");
    const getProdutos = async () => {
      console.log("7");
      try {
        const response = await fetch("http://localhost:8080/produtos");
        if (!response.ok) {
          throw new Error("Ocorreu um erro ao recuperar produtos. Status: " + response.status);
        }
        console.log("9");
        setProdutos(await response.json());
      } catch(error) {
          if (error instanceof Error) {
            setErro(error.message)
          }
          else {
            setErro("Ocorreu um erro desconhecido. Error: " + error);
          }
      }
    }
    console.log("6");
    getProdutos();
    console.log("8");
  }, [])

  console.log("3, 12");

  // "" em javascript é avaliado para falsy
  if (erro) return <p className="text-lg">{erro}</p>;
  if (produtos.length === 0) {
    console.log("4");
    return <p className="text-lg">Recuperando produtos...</p>;
  } 
  console.log("13");
  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  )
}
export default ListarProdutosPage