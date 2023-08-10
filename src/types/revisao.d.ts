import IAcao from "./acao"
import IProjeto from "./projeto";
import ISituacao from "./situacao";

export default interface IRevisao {
  acoes: IAcao[];
  aprovador: string;
  dataAprovacao: string;
  dataCriacao?: string;
  executor: string;
  id?: number | string;
  idProjeto?: IProjeto;
  situacao?: ISituacao | string | number;
  solicitante: string;
  sprint?: string;
  tipo: string;
  titulo: string;
}