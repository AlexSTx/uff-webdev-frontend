import { useRef } from "react"

interface Props {
    tratarPesquisa: (nome: string) => void;
}
const Pesquisa = ({tratarPesquisa}: Props) => {
  const nomeRef = useRef<HTMLInputElement>(null);  
  return (
    <form onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        tratarPesquisa(nomeRef.current!.value);
    }} className="flex mb-3">
        <input ref={nomeRef} type="text" className="input me-3" />
        <button type="submit" className="btn-success px-4 py-1">Pesquisar</button>
    </form>
  )
}
export default Pesquisa