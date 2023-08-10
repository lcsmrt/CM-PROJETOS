export const formataDataBRParaISO = (dataBR: string) => {
  if (dataBR) {
    const [dia, mes, ano] = dataBR.split(' / ');
    return `${ano}-${mes}-${dia}`;
  }
  else {
    return ""
  }
};