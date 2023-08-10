import IRevisao from "./revisao"
import ISituacao from "./situacao";

export default interface IAcao {
  cliente: string;
  dataCricacao?: string;
  dataPrevista: string;
  descricao: string;
  executor: string;
  id?: number | string;
  idRevisao?: IRevisao[];
  situacao?: ISituacao | string | number;
  titulo: string;
}