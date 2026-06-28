import { createBrowserRouter, Navigate } from "react-router-dom";
import CadastrarProdutoPage from "../pages/CadastrarProdutoPage";
import CadastroPage from "../pages/CadastroPage";
import CarrinhoPage from "../pages/CarrinhoPage";
import CheckoutPage from "../pages/CheckoutPage";
import ErrorPage from "../pages/ErrorPage";
import EsqueceuSenhaPage from "../pages/EsqueceuSenhaPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import PagamentoPage from "../pages/PagamentoPage";
import ProdutoPage from "../pages/ProdutoPage";
import ProdutosComPaginacaoPage from "../pages/ProdutosComPaginacaoPage";
import Layout from "./Layout";
import ProdutosPage from "../pages/ProdutosPage";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            // A linha abaixo define a rota “índice” (a rota padrão) dentro do grupo de rotas
            // filhas do caminho /. Ou seja, quando o usuário acessa exatamente /, ela redireciona 
            // automaticamente para /home.
            // - index: true marca essa rota como a padrão do pai.
            // - <Navigate to="/home" replace /> faz o redirecionamento.
            // - replace troca a entrada no histórico (o usuário não volta para / ao apertar “voltar”).
            {index: true, element: <Navigate to="/home" replace />},
            {path: "home", element: <HomePage />},
            {path: "carrinho", element: <CarrinhoPage />},
            {path: "produtos-sem-paginacao", element: <ProdutosPage />},
            {path: "produtos-com-paginacao", element: <ProdutosComPaginacaoPage />},
            {path: "produtos/:id", element: <ProdutoPage />},
            {path: "login", element: <LoginPage />},
            {path: "cadastro", element: <CadastroPage />},
            {path: "esqueceu-senha", element: <EsqueceuSenhaPage />},
            // A página de erro já faz isso
            // {path: "*", element: <h5 className="text-xl text-center mt-3">404 - Página não encontrada</h5>}
        ]
    },
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <ErrorPage />,
        children: [
            {path: "checkout", element: <CheckoutPage />},
            {path: "pagamento/:id", element: <PagamentoPage />},
        ]
    },
    {
        path: "/",
        element: <AdminRoutes />,
        errorElement: <ErrorPage />,
        children: [
            {path: "cadastrar-produto", element: <CadastrarProdutoPage />},
        ]
    }
])
export default router;