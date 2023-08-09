import { useState, useEffect } from 'react';
import criarRequisicaoHTTP from './http';
import axios, { AxiosResponse } from 'axios';

type RespostaGet<T> = {
  dados: T | null;
  carregando: boolean;
  erro: Error | null;
}

function useGet<T>(url: string, dependencias: any[]): RespostaGet<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<Error | null>(null);

  useEffect(() => {
    const requisicaoHTTP = criarRequisicaoHTTP();
    const origem = axios.CancelToken.source();

    requisicaoHTTP.get<T>(url, { cancelToken: origem.token })
      .then((resposta: AxiosResponse<T>) => {
        setDados(resposta.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error(error);
        setErro(error);
        setCarregando(false);
      });

    // Cancela requisição caso componente desmonte
    return () => {
      origem.cancel();
    };
  }, [url, ...dependencias]);

  return { dados, carregando, erro };
}

export default useGet;