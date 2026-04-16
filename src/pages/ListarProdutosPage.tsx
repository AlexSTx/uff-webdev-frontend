import { useEffect, useState } from "react";
import TabelaDeProdutos from "../components/TabelaDeProdutos";

const ListarProdutosPage = () => {
  // const produtos = recuperarProdutos();
  
  console.log("1, 9");
  
  // const numeros: number[] = [1, 2, 3];
  // console.log(numeros[0]);

  // const [um, dois, tres]: number[] = [1, 2, 3];
  // console.log(um);

  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  console.log("2, 10");

  useEffect(() => {
    console.log("5");

    fetch("http://localhost:8080/produtos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ocorreu um erro ao recuperar produtos. Status: " + response.status);
        }
        console.log("7");
        return response.json();
      })
      .then((produtos) => {
        console.log("8");
        setProdutos(produtos);
      })
      .catch ((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
        else {
          setErro("Ocorreu um erro desconhecido. Error: " + error);
        }
      });
    console.log("6");  
  }, [])

  console.log("3, 11");

  // "" em javascript é avaliado para falsy
  if (erro) return <p className="text-lg">{erro}</p>;
  if (produtos.length === 0) {
    console.log("4");
    return <p className="text-lg">Recuperando produtos...</p>;
  } 
  console.log("12");
  return (
    <>
      <h1 className="text-xl font-semibold mb-1">Lista de Produtos</h1>
      <hr className="mb-4" />
      <TabelaDeProdutos produtos={produtos} />
    </>
  )
}
export default ListarProdutosPage