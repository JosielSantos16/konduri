import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_EQUILIBRIO } from '../../../utils/financeiro';
import { formatPrice } from '../../../utils/formatPrice';
import {
  EquilibrioCard,
  EquilibrioHeader,
  EquilibrioTitulo,
  EquilibrioLinha,
  EquilibrioLabel,
  EquilibrioValor,
  BarraFundo,
  BarraPreenchida,
  BarraLegenda,
  EquilibrioMensagem,
  EquilibrioSubmensagem,
  MetaDiariaBox,
  MetaDiariaBloco,
  MetaDiariaLabel,
  MetaDiariaValor,
} from './pontoEquilibrioCardStyle';

function formatarProgresso(progresso) {
  return `${progresso.toFixed(1).replace('.', ',')}%`;
}

export default function PontoEquilibrioCard({ pontoEquilibrio, faturamento, custosFixos }) {
  const { status, valor, progresso, faltam, excedente, diasRestantes, metaDiaria } = pontoEquilibrio;
  const atingido = status === STATUS_EQUILIBRIO.ATINGIDO;

  return (
    <EquilibrioCard atingido={atingido}>
      <EquilibrioHeader>
        <Ionicons name="flag-outline" size={18} color="#8C7355" />
        <EquilibrioTitulo>PONTO DE EQUILÍBRIO</EquilibrioTitulo>
      </EquilibrioHeader>

      {status === STATUS_EQUILIBRIO.SEM_FATURAMENTO && (
        <>
          <EquilibrioLinha>
            <EquilibrioLabel>Custos fixos a cobrir</EquilibrioLabel>
            <EquilibrioValor>{formatPrice(custosFixos)}</EquilibrioValor>
          </EquilibrioLinha>
          <EquilibrioSubmensagem>
            Ainda não há vendas no período. A meta é calculada a partir da margem das vendas, assim
            que a primeira venda entrar.
          </EquilibrioSubmensagem>
        </>
      )}

      {status === STATUS_EQUILIBRIO.INATINGIVEL && (
        <>
          <EquilibrioMensagem cor="#C0392B">⚠ Margem de contribuição negativa</EquilibrioMensagem>
          <EquilibrioSubmensagem>
            O CMV e os custos variáveis estão maiores que o faturamento: cada venda aumenta o prejuízo
            e o ponto de equilíbrio não pode ser atingido. Revise preços de venda, custos dos produtos e
            despesas variáveis.
          </EquilibrioSubmensagem>
        </>
      )}

      {(status === STATUS_EQUILIBRIO.EM_ANDAMENTO || status === STATUS_EQUILIBRIO.ATINGIDO) &&
        custosFixos <= 0 && (
          <EquilibrioSubmensagem>
            Nenhum custo fixo cadastrado no período, então não há meta a atingir. Cadastre aluguel,
            salários e outras despesas fixas em Custos e Despesas.
          </EquilibrioSubmensagem>
        )}

      {(status === STATUS_EQUILIBRIO.EM_ANDAMENTO || status === STATUS_EQUILIBRIO.ATINGIDO) &&
        custosFixos > 0 && (
          <>
            <EquilibrioLinha>
              <EquilibrioLabel>Meta do período</EquilibrioLabel>
              <EquilibrioValor>{formatPrice(valor)}</EquilibrioValor>
            </EquilibrioLinha>
            <EquilibrioLinha>
              <EquilibrioLabel>Faturado</EquilibrioLabel>
              <EquilibrioValor>{formatPrice(faturamento)}</EquilibrioValor>
            </EquilibrioLinha>

            <BarraFundo>
              <BarraPreenchida atingido={atingido} style={{ width: `${Math.min(100, progresso)}%` }} />
            </BarraFundo>
            <BarraLegenda>{formatarProgresso(progresso)}</BarraLegenda>

            {atingido ? (
              <>
                <EquilibrioMensagem cor="#2E5A1E">✓ Ponto de equilíbrio atingido</EquilibrioMensagem>
                <EquilibrioSubmensagem>
                  {formatPrice(excedente)} acima do ponto de equilíbrio. A partir daqui, cada venda
                  aumenta o resultado (descontados o CMV e os custos variáveis).
                </EquilibrioSubmensagem>
              </>
            ) : (
              <EquilibrioMensagem>
                Faltam {formatPrice(faltam)} para atingir o ponto de equilíbrio.
              </EquilibrioMensagem>
            )}

            {!atingido && metaDiaria !== null && (
              <MetaDiariaBox>
                <MetaDiariaBloco>
                  <MetaDiariaLabel>FALTAM</MetaDiariaLabel>
                  <MetaDiariaValor>{formatPrice(faltam)}</MetaDiariaValor>
                </MetaDiariaBloco>
                <MetaDiariaBloco>
                  <MetaDiariaLabel>RESTAM</MetaDiariaLabel>
                  <MetaDiariaValor>
                    {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
                  </MetaDiariaValor>
                </MetaDiariaBloco>
                <MetaDiariaBloco>
                  <MetaDiariaLabel>META / DIA</MetaDiariaLabel>
                  <MetaDiariaValor>{formatPrice(metaDiaria)}</MetaDiariaValor>
                </MetaDiariaBloco>
              </MetaDiariaBox>
            )}
          </>
        )}
    </EquilibrioCard>
  );
}
