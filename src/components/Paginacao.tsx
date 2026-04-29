interface Props {
    pagina: number,
    totalDePaginas: number,
    tratarPaginacao: (pagina: number) => void
}

const Paginacao = ({pagina, totalDePaginas, tratarPaginacao}: Props) => {

  const pages = Array.from({length: totalDePaginas}).map((_, index) => index);  

  return (
    <nav aria-label="Paginação">
      <ul className="flex">
        <li>
          <button type="button" disabled={pagina === 0} onClick={() => tratarPaginacao(pagina-1)}
            className={
              "rounded-l-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-200 " +
              (pagina === 0 ? "cursor-not-allowed bg-gray-300 opacity-50" : 
                              "cursor-pointer bg-white text-green-700")
            }
          >
            Anterior
          </button>
        </li>

        {pages.map((page) => (
          <li key={page}>
            <button type="button" onClick={() => tratarPaginacao(page)} 
              className={"cursor-pointer border px-4 py-2 font-semibold " + 
                (pagina === page ? "border-green-800 bg-green-700 text-white" : 
                                   "border-gray-300 bg-white text-green-600 hover:bg-gray-100")}
            >
              {page + 1}
            </button>
          </li>
        ))}

        <li>
          <button type="button" disabled={pagina === totalDePaginas - 1} onClick={() => tratarPaginacao(pagina+1)}
            className={"rounded-r-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-200 " + 
              (pagina === totalDePaginas - 1 ? "cursor-not-allowed bg-gray-300 opacity-50" : 
                                               "cursor-pointer bg-white text-green-700")}
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default Paginacao