
interface Props {
    tratarPesquisa: (nome: string) => void;
}
const Pesquisa = ({tratarPesquisa}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    tratarPesquisa(event.target.value);
  }
  
  return (
    <input onChange={handleChange} type="text" className="input mb-3" placeholder="Informe o nome do produto desejado..." />
  )
}
export default Pesquisa