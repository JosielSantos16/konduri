const HORA_ABERTURA = 8; 
const HORA_FECHAMENTO = 23; 

export function getStatusCaixa(horaAbertura = HORA_ABERTURA, horaFechamento = HORA_FECHAMENTO) {
  const agora = new Date();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;

  let aberto;

  if (horaAbertura < horaFechamento) {
    aberto = horaAtual >= horaAbertura && horaAtual < horaFechamento;
  } else {
    aberto = horaAtual >= horaAbertura || horaAtual < horaFechamento;
  }

  return {
    aberto,
    label: aberto ? 'Caixa Aberto' : 'Caixa Fechado',
  };
}