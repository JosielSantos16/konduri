// Regras de custos e despesas, sem acesso ao Firestore. Usadas pela tela de
// Custos e Despesas e, depois, pelos cálculos da Gestão Financeira.
//
// Competência é sempre uma string 'AAAA-MM'.

export const TIPOS_DESPESA = {
  FIXO: 'FIXO',
  VARIAVEL: 'VARIAVEL',
};

export const FORMAS_CALCULO = {
  VALOR: 'VALOR',
  PERCENTUAL: 'PERCENTUAL',
};

export const PERIODICIDADES = {
  UNICA: 'UNICA',
  DIARIA: 'DIARIA',
  SEMANAL: 'SEMANAL',
  MENSAL: 'MENSAL',
  ANUAL: 'ANUAL',
};

export const ROTULOS_PERIODICIDADE = {
  UNICA: 'Única',
  DIARIA: 'Diária',
  SEMANAL: 'Semanal',
  MENSAL: 'Mensal',
  ANUAL: 'Anual',
};

export const CATEGORIAS_DESPESA = [
  'Pessoal',
  'Energia',
  'Água',
  'Internet',
  'Aluguel',
  'Transporte',
  'Manutenção',
  'Impostos',
  'Taxas',
  'Marketing',
  'Administrativo',
  'Outros',
];

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function competenciaDe(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export function deslocarCompetencia(competencia, meses) {
  const [ano, mes] = competencia.split('-').map(Number);
  return competenciaDe(new Date(ano, mes - 1 + meses, 1));
}

export function formatarCompetencia(competencia) {
  const [ano, mes] = competencia.split('-').map(Number);
  return `${NOMES_MESES[mes - 1]} de ${ano}`;
}

export function diasNoMes(competencia) {
  const [ano, mes] = competencia.split('-').map(Number);
  return new Date(ano, mes, 0).getDate();
}

function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

export function ehRecorrente(despesa) {
  return despesa.periodicidade !== PERIODICIDADES.UNICA;
}

// Despesa única vale só na própria competência. Recorrente vale da competência
// inicial em diante, até competenciaFim (inclusive) se tiver sido encerrada.
export function despesaValeNaCompetencia(despesa, competencia) {
  if (!ehRecorrente(despesa)) return despesa.competencia === competencia;
  if (competencia < despesa.competencia) return false;
  return !despesa.competenciaFim || competencia <= despesa.competenciaFim;
}

// Quanto uma despesa em R$ pesa no mês. Diária e semanal são multiplicadas
// pelos dias do mês; anual é rateada em 12 meses. Percentual retorna null:
// o valor depende do faturamento e é calculado na Gestão.
export function valorNaCompetencia(despesa, competencia) {
  if (despesa.forma === FORMAS_CALCULO.PERCENTUAL) return null;

  const valor = despesa.valor || 0;
  switch (despesa.periodicidade) {
    case PERIODICIDADES.DIARIA:
      return arredondarCentavos(valor * diasNoMes(competencia));
    case PERIODICIDADES.SEMANAL:
      return arredondarCentavos((valor * diasNoMes(competencia)) / 7);
    case PERIODICIDADES.ANUAL:
      return arredondarCentavos(valor / 12);
    default:
      return arredondarCentavos(valor);
  }
}

export function pagaNaCompetencia(despesa, competencia) {
  if (!ehRecorrente(despesa)) return !!despesa.pago;
  return !!despesa.pagamentos?.[competencia];
}

// Vencimento exibido no mês: recorrentes mensais/semanais/diárias repetem o dia
// do vencimento cadastrado (limitado ao último dia do mês).
export function vencimentoNaCompetencia(despesa, competencia) {
  if (!despesa.dataVencimento) return null;
  if (!ehRecorrente(despesa) || despesa.periodicidade === PERIODICIDADES.ANUAL) {
    return despesa.dataVencimento;
  }
  const dia = Math.min(Number(despesa.dataVencimento.slice(8, 10)), diasNoMes(competencia));
  return `${competencia}-${String(dia).padStart(2, '0')}`;
}

export function ocorrenciasDaCompetencia(despesas, competencia) {
  return despesas
    .filter((despesa) => despesaValeNaCompetencia(despesa, competencia))
    .map((despesa) => ({
      despesa,
      valor: valorNaCompetencia(despesa, competencia),
      percentual: despesa.forma === FORMAS_CALCULO.PERCENTUAL ? despesa.percentual : null,
      pago: pagaNaCompetencia(despesa, competencia),
      vencimento: vencimentoNaCompetencia(despesa, competencia),
    }));
}

// Totais do mês. Comissões de atendentes entram como custo variável em R$.
export function resumirCompetencia(ocorrencias, totalComissoes = 0) {
  const resumo = {
    fixos: 0,
    variaveisValor: 0,
    variaveisPercentual: 0,
    comissoes: arredondarCentavos(totalComissoes),
    emAberto: 0,
  };

  ocorrencias.forEach(({ despesa, valor, percentual, pago }) => {
    if (percentual !== null) {
      resumo.variaveisPercentual += percentual;
      return;
    }
    if (despesa.tipo === TIPOS_DESPESA.FIXO) resumo.fixos += valor;
    else resumo.variaveisValor += valor;
    if (!pago) resumo.emAberto += valor;
  });

  resumo.fixos = arredondarCentavos(resumo.fixos);
  resumo.variaveisValor = arredondarCentavos(resumo.variaveisValor + resumo.comissoes);
  resumo.variaveisPercentual = Math.round(resumo.variaveisPercentual * 100) / 100;
  resumo.emAberto = arredondarCentavos(resumo.emAberto);
  return resumo;
}
