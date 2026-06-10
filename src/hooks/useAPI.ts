import { URL_BASE } from "../util/constantes";

const useAPI = <T>(endpoint: string) => {
    const URL = URL_BASE + endpoint;

    const recuperar = async (): Promise<T[]> => {
        // const num = await new Promise<number>((resolve) => {
        //     setTimeout(() => {
        //         return resolve(1)
        //     }, 1000)
        // })  
        // console.log(num);
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(
                "Ocorreu um erro ao efetuar uma requisição do tipo GET para " + URL + ". Status: " + response.status,
            );
        }
        return await response.json();
    };

    return { recuperar }
}
export default useAPI;
