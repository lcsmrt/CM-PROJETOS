import IAcao from "./acao"
import IProjeto from "./projeto";

export default interface IRevisao {
  acoes: IAcao[],
  aprovador: string,
  dataAprovacao: string,
  dataCriacao?: string,
  executor: string,
  id?: number | string,
  idProjeto?: IProjeto,
  solicitante: string,
  sprint?: string,
  tipo: string,
  titulo: string
}