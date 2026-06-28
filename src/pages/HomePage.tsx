import { Link } from "react-router-dom";
import CarrosselProdutos from "../components/CarrosselProdutos";
import useRecuperarProdutos from "../hooks/produto/useRecuperarProdutos";

const HomePage = () => {
  // Reaproveita o hook que a página de produtos (sem paginação) já usa.
  // Aqui não há filtro nem paginação no lado do backend — recebemos a lista
  // completa e dividimos por categoria no próprio componente (ver abaixo).
  const { data: produtos, isPending } = useRecuperarProdutos();

  // array de produtos vindo da useRecuperarProdutos.
  // necessário o operador nullish para caso useRecuperarProdutos
  // ainda esteja carregando (produtos === undefined).
  // const produtos = useRecuperarProdutos();

  return (
    <div className="space-y-6">
      {/* Banner principal — destaque da loja com CTA para a listagem.
          A imagem de fundo é um gradiente CSS (bg-gradient-to-r) para
          não depender de nenhum asset externo. */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight">
            Kachow!
          </h2>
          <p className="mb-4 text-gray-200">
            As melhores peças de computador com os menores preços. Confira nossas ofertas!
          </p>
          <Link
            to="/produtos-com-paginacao"
            className="inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white duration-200 hover:bg-orange-600"
          >
            Ver produtos
          </Link>
        </div>
      </div>

      {/* Cards de categorias — atalhos visuais para a listagem de produtos.
          Cada card linka para /produtos-sem-paginacao (não há rota por
          categoria). Os ícones vêm do Bootstrap Icons, já importado no
          projeto via o NavBar. sm:grid-cols-3 liga em telas ≥ 640px. */}
      <div>
        <h3 className="mb-3 text-xl font-bold text-gray-800">Categorias</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/produtos-sem-paginacao"
            className="card flex items-center gap-3 transition hover:shadow-md"
          >
            <i className="bi bi-cpu text-3xl text-orange-500"></i>
            <div>
              <p className="font-bold text-gray-800">Processadores</p>
              <p className="text-sm text-gray-600">Desempenho para qualquer uso</p>
            </div>
          </Link>
          <Link
            to="/produtos-sem-paginacao"
            className="card flex items-center gap-3 transition hover:shadow-md"
          >
            <i className="bi bi-gpu-card text-3xl text-orange-500"></i>
            <div>
              <p className="font-bold text-gray-800">Placas de Vídeo</p>
              <p className="text-sm text-gray-600">Pleno desempenho gráfico</p>
            </div>
          </Link>
          <Link
            to="/produtos-sem-paginacao"
            className="card flex items-center gap-3 transition hover:shadow-md"
          >
            <i className="bi bi-memory text-3xl text-orange-500"></i>
            <div>
              <p className="font-bold text-gray-800">Memórias RAM</p>
              <p className="text-sm text-gray-600">Mais velocidade pro seu PC</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Carrosséis por categoria — cada um filtra o mesmo array de produtos
          pelo id da categoria. Não criamos queries separadas nem alteramos o
          backend; o filter() é JS puro e roda no cliente.

          categoria.id === 1 → Processadores
          categoria.id === 2 → Placas de Vídeo
          categoria.id === 3 → Memórias RAM

          O CarrosselProdutos já retorna null quando recebe uma lista vazia,
          então o título "Processadores" continua aparecendo mesmo sem
          produtos, mas o carrossel sumirá sozinho. */}
      {isPending ? (
        <p className="text-gray-600">Carregando produtos...</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">Processadores</h3>
            <CarrosselProdutos produtos={(produtos ?? []).filter((p) => p.categoria.id === 1)} />
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">Placas de Vídeo</h3>
            <CarrosselProdutos produtos={(produtos ?? []).filter((p) => p.categoria.id === 2)} />
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-800">Memórias RAM</h3>
            <CarrosselProdutos produtos={(produtos ?? []).filter((p) => p.categoria.id === 3)} />
          </div>
        </div>
      )}
    </div>
  )
}
export default HomePage