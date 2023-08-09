import IRevisao from "./revisao"

export default interface IAcao {
  cliente: string,
  dataCricacao?: string,
  dataPrevista: string,
  descricao: string,
  executor: string,
  id?: number | string,
  idRevisao?: IRevisao[],
  titulo: string
}