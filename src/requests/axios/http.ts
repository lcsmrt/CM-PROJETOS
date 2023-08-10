import axios from "axios";

const criarRequisicaoHTTP = () => {
  const requisicaoHTTP = axios.create({
    baseURL: `http://192.168.228.8:8082`,
  })

  requisicaoHTTP.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
    function (error) {
      return Promise.reject(error);
    })

  return requisicaoHTTP;
}

export default criarRequisicaoHTTP;