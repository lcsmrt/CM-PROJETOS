import IRevisao from "./revisao";

export default interface IProjeto {
  dataAbertura?: string,
  descricao: string,
  id?: number | string,
  justificativa: string,
  situacao?: ISituacao | string | number;
  solicitante: string,
  revisoes?: IRevisao[],
  titulo: string,
}