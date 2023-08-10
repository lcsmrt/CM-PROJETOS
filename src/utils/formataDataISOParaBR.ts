export const formataDataISOParaBR = (dataISO: string) => {
  if (dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate() + 1).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia} / ${mes} / ${ano}`;
  }
  else {
    return ""
  }
};