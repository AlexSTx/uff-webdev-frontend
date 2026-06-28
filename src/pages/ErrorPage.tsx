import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";
import isErrorResponse from "../util/isErrorResponse";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <NavBar />
      <div className="mx-3 pb-8 md:mx-10 lg:mx-20">
        <h1 className="mb-1 text-xl font-semibold">Página de Erro</h1>
        <hr className="mb-4" />
        <div className="alert-error">
          <i className="bi bi-x-octagon-fill mt-0.5"></i>
          <div>
            {isRouteErrorResponse(error) ? (
              "Página requisitada inválida"
            ) : error instanceof Error ? (
              error.message
            ) : isErrorResponse(error) ? (
              <div>
                <p className="font-semibold">Mensagem do servidor:</p>
                <pre className="mt-1 text-sm">{JSON.stringify(error, null, 2)}</pre>
              </div>
            ) : (
              "Erro desconhecido. Msg: " + error
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ErrorPage;
