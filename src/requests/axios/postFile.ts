import { useState } from "react";
import axios from "axios";
import criarRequisicaoHTTP from "./http";

function usePostFile<T>() {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const requisicaoHTTP = criarRequisicaoHTTP();

  const postFile = (url: string, file: File): Promise<T> => {
    setCarregando(true);
    const origem = axios.CancelToken.source();

    const formData = new FormData();
    formData.append('file', file);

    return requisicaoHTTP
      .post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        cancelToken: origem.token
      })
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

  return { postFile, carregando, erro };
}

export default usePostFile;