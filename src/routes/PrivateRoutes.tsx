import { Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import useUsuarioStore from "../store/UsuarioStore";

const PrivateRoutes = () => {
  const usuarioLogado = useUsuarioStore((s) => s.usuarioLogado);
  const location = useLocation();
  
  if (usuarioLogado) {
    return <Layout />;
  }
  else {
    return <Navigate to="/login" state={{destino: location.pathname}} />;
  }
}
export default PrivateRoutes