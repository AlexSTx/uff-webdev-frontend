import type { Produto } from "../interfaces/Produto";

interface Props {
    produtos: Produto[];
}

const TabelaDeProdutos = ({produtos}: Props) => {
  return (
    <div>{produtos[0].nome}</div>
  )
}
export default TabelaDeProdutos