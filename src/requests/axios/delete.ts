import { useState } from "react";
import criarRequisicaoHTTP from "./http";

function useDelete<T>() {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const requisicaoHTTP = criarRequisicaoHTTP();

  const del = (url: string): Promise<T> => {
    setCarregando(true);
    return requisicaoHTTP
      .delete<T>(url)
      .then((resposta) => {
        setCarregando(false);
        return resposta.data;
      })
      .catch((erro) => {
        setCarregando(false);
        setErro(erro);
        return Promise.reject(erro);
      });
  };

  return { del, carregando, erro };
}

export default useDelete;