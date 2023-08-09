import IRevisao from "./revisao";

export default interface IProjeto {
  dataAbertura?: string,
  descricao: string,
  id?: number | string,
  justificativa: string,
  solicitante: string,
  revisoes?: IRevisao[],
  titulo: string,
}