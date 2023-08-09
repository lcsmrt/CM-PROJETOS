export const formataDataBRParaISO = (dataBR: string) => {
  const [dia, mes, ano] = dataBR.split(' / ');
  return `${ano}-${mes}-${dia}`;
};