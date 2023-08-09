import { useState } from 'react';
import criarRequisicaoHTTP from './http';

function usePut<T>() {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const requisicaoHTTP = criarRequisicaoHTTP();

  const put = (url: string, dados: any): Promise<T> => {
    setCarregando(true);
    return requisicaoHTTP
      .put<T>(url, dados)
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

  return { put, carregando, erro };
}

export default usePut;