
interface Props {
    tratarPesquisa: (nome: string) => void;
}
const Pesquisa = ({tratarPesquisa}: Props) => {
  let timeout: number = 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        tratarPesquisa(event.target.value);
    }, 1000);
    console.log(timeout);
  }
  
  return (
    <input onChange={handleChange} type="text" className="input mb-3" placeholder="Informe o nome do produto desejado..." />
  )
}
export default Pesquisa