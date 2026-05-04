import _ from "lodash";

interface Props {
  tratarPesquisa: (nome: string) => void;
}
const Pesquisa = ({ tratarPesquisa }: Props) => {
  const debouncedFunction = _.debounce((nome: string) => {
    (tratarPesquisa(nome));
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFunction(event.target.value);
  };

  return (
    <input
      onChange={handleChange}
      type="text"
      className="input mb-3"
      placeholder="Informe o nome do produto desejado..."
    />
  );
};
export default Pesquisa;
