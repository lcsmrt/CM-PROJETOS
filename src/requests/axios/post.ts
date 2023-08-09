import { useState } from 'react';
import criarRequisicaoHTTP from './http';
import axios from 'axios';

function usePost<T>() {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const requisicaoHTTP = criarRequisicaoHTTP();

  const post = (url: string, dados: any): Promise<T> => {
    setCarregando(true);
    const origem = axios.CancelToken.source();
    
    return requisicaoHTTP
      .post<T>(url, dados, { cancelToken: origem.token })
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

  return { post, carregando, erro };
}

export default usePost;