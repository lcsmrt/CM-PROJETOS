export const formataDinheiro = (value: string) => {
  if(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
  }
  else {
    return ""
  }
};