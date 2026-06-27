import { Navigate, useLocation } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import Layout from "./Layout";

const AdminRoutes = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const location = useLocation();

  if (tokenResponse.idUsuario > 0 && tokenResponse.role === "ADMIN") {
    return <Layout />
  }
  else if (tokenResponse.idUsuario > 0) {
    return <Navigate to="/home" replace />
  }
  else {
    return <Navigate to="/login" state={{destino: location.pathname}} />
  }
}
export default AdminRoutes