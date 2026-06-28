import "bootstrap-icons/font/bootstrap-icons.min.css";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { Produto } from "../interfaces/Produto";
import useProdutoStore from "../store/ProdutoStore";
import useTokenStore from "../store/TokenStore";

// Modos do Tailwindcss:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const setTokenResponse = useTokenStore((s) => s.setTokenResponse);
  const setProdutoSelecionado = useProdutoStore((s) => s.setProdutoSelecionado);
  const navigate = useNavigate();

  // Logout explícito. Antes, o logout acontecia como efeito colateral do
  // mount da LoginPage — o que deslogava qualquer um que passasse por /login.
  const efetuarLogout = () => {
    setTokenResponse({ token: "", idUsuario: 0, nome: "", role: "" });
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="mb-6 border-b border-gray-200 bg-gray-50 py-4 shadow-sm">
      <div className="mx-3 md:mx-10 lg:mx-20">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-extrabold tracking-tight text-orange-500">Kachow!</span>
            </NavLink>
            <NavLink
              className={({ isActive }) => "hidden md:block text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              aria-current="page"
              to="/"
            >
              <i className="bi bi-house me-1"></i>
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => "hidden md:block text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/carrinho"
            >
              <i className="bi bi-cart3 me-1"></i>
              Carrinho
            </NavLink>
            {tokenResponse.idUsuario > 0 && (
              <NavLink
                className={({ isActive }) => "hidden md:block text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
                to="/meus-pedidos"
              >
                <i className="bi bi-bag-check me-1"></i>
                Meus Pedidos
              </NavLink>
            )}
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/produtos-sem-paginacao"
            >
              <i className="bi bi-card-list me-1"></i>
              Produtos sem Paginação
            </NavLink>
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/produtos-com-paginacao"
            >
              <i className="bi bi-card-list me-1"></i>
              Produtos com Paginação
            </NavLink>
            {tokenResponse.role === "ADMIN" && (
              <NavLink
                onClick={() => setProdutoSelecionado({} as Produto)}
                className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
                to="/cadastrar-produto"
              >
                <i className="bi bi-database-add me-1"></i>
                Cad. Produto
              </NavLink>
            )}
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/login"
              onClick={() => {
                if (tokenResponse.idUsuario > 0) efetuarLogout();
              }}
            >
              {tokenResponse.idUsuario > 0 ?
                <>
                  <i className="bi bi-box-arrow-left me-1"></i>
                  Sair
                </> :
                <>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Entrar
                </>
              }
            </NavLink>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={
              "rounded-lg bg-gray-300 p-2 text-gray-700 md:hidden hover:bg-gray-400 " +
              (isOpen ? "bg-gray-400" : "")
            }
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="mt-4 flex flex-col space-y-2 rounded-lg border border-gray-200 bg-white p-3 shadow md:hidden">
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              aria-current="page"
              to="/"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-house me-1"></i>
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/carrinho"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-cart3 me-1"></i>
              Carrinho
            </NavLink>
            {tokenResponse.idUsuario > 0 && (
              <NavLink
                className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
                to="/meus-pedidos"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-bag-check me-1"></i>
                Meus Pedidos
              </NavLink>
            )}
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/produtos-sem-paginacao"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-card-list me-1"></i>
              Produtos sem Paginação
            </NavLink>
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/produtos-com-paginacao"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-card-list me-1"></i>
              Produtos com Paginação
            </NavLink>
            {tokenResponse.role === "ADMIN" && (
              <NavLink
                className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
                to="/cadastrar-produto"
                onClick={() => {
                  setIsOpen(false);
                  setProdutoSelecionado({} as Produto);
                }}
              >
                <i className="bi bi-database-add me-1"></i>
                Cad. Produto
              </NavLink>
            )}
            <NavLink
              className={({ isActive }) => "text-gray-700 hover:text-orange-500 " + (isActive ? "font-semibold text-orange-600" : "")}
              to="/login"
              onClick={() => {
                setIsOpen(false);
                if (tokenResponse.idUsuario > 0) efetuarLogout();
              }}
            >
              {tokenResponse.idUsuario > 0 ?
                <>
                  <i className="bi bi-box-arrow-left me-1"></i>
                  Sair
                </> :
                <>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Entrar
                </>
              }
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
export default NavBar;
