const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_COMPLETOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const getSaudacaoData = () => {
  const hoje = new Date();
  return `${DIAS[hoje.getDay()]}, ${hoje.getDate()} de ${MESES[hoje.getMonth()]}`;
};

export const formatDataHoraComprovante = (dataISO) => {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
};

export const formatHora = (dataISO) => {
  const data = new Date(dataISO);
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${hora}:${min}`;
};

// Aceita uma data específica; mostra "Hoje, ..." quando for o dia atual
export const formatDataFiltro = (date = new Date()) => {
  const hoje = new Date();
  const isHoje =
    date.getDate() === hoje.getDate() &&
    date.getMonth() === hoje.getMonth() &&
    date.getFullYear() === hoje.getFullYear();
  const dia = String(date.getDate()).padStart(2, '0');
  const label = `${dia} ${MESES_ABREV[date.getMonth()]} ${date.getFullYear()}`;
  return isHoje ? `Hoje, ${label}` : label;
};

export const formatDataExtenso = (date) => {
  const d = new Date(date);
  return `${d.getDate()} de ${MESES_COMPLETOS[d.getMonth()]} de ${d.getFullYear()}`;
};

export const isMesmoDia = (dataISO, referencia = new Date()) => {
  const data = new Date(dataISO);
  return (
    data.getDate() === referencia.getDate() &&
    data.getMonth() === referencia.getMonth() &&
    data.getFullYear() === referencia.getFullYear()
  );
};