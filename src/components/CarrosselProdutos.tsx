import { Link } from "react-router-dom";
import type { Produto } from "../interfaces/Produto";

interface Props {
  produtos: Produto[];
}

// Row horizontal com scroll do próprio navegador (overflow-x-auto).
// Sem autoplay, sem setas, sem libs — apenas CSS. Recebe a lista pronta,
// igual à TabelaDeProdutos, então não acopla com nenhuma lógica de busca.
const CarrosselProdutos = ({ produtos }: Props) => {
  if (produtos.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {produtos.map((produto) => (
        <Link
          key={produto.id}
          to={"/produtos/" + produto.id}
          className="card min-w-[200px] max-w-[200px] flex-shrink-0 items-center text-center transition hover:shadow-md"
        >
          <div className="mb-2 flex h-28 items-center justify-center">
            <img src={"/" + produto.imagem} width="90px" alt={produto.nome} />
          </div>
          <p className="mb-1 line-clamp-1 font-bold text-gray-800">
            {produto.nome}
          </p>
          <p className="mb-2 text-sm text-gray-500 line-clamp-1">
            {produto.descricao}
          </p>
          <span className="block font-bold text-orange-600">
            {produto.preco?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </Link>
      ))}
    </div>
  );
};
export default CarrosselProdutos;