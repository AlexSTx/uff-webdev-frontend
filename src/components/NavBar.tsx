import { NavLink } from "react-router-dom";
import hortifruti from "../assets/hortifruti.png";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { useState } from "react";

// Modos do Tailwindcss:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="mb-6 bg-gray-100 py-4">
      <div className="mx-3 md:mx-10 lg:mx-20">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <NavLink to="/">
              <img src={hortifruti} width="45px" />
            </NavLink>
            <NavLink
              className="text-gray-700 hover:text-black hidden md:block"
              aria-current="page"
              to="/"
            >
              <i className="bi bi-house me-1"></i>
              Home
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black hidden md:block" to="/carrinho">
              <i className="bi bi-cart3 me-1"></i>
              Carrinho
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black hidden md:block" to="/favoritos">
              <i className="bi bi-heart me-1"></i>
              Favoritos
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              className="text-gray-700 hover:text-black"
              to="/listar-produtos"
            >
              <i className="bi bi-card-list me-1"></i>
              Listar Produtos
            </NavLink>
            <NavLink
              className="text-gray-700 hover:text-black"
              to="/cadastrar-produto"
            >
              <i className="bi bi-database-add me-1"></i>
              Cad. Produto
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Entrar
            </NavLink>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={
              "rounded bg-gray-400 p-2 text-white md:hidden " +
              (isOpen ? "border-2 border-gray-800" : "border border-gray-400")
            }
          >
            {/* Use um ícone de hambúrguer aqui */}
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
      </div>
    </nav>
  );
};
export default NavBar;
