import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RegistrarEntradaPortariaModal from './RegistrarEntradaPortariaModal';
import { useVendas } from '../../contexts/VendasContext';
import { subscribeToConfigEntradas, subscribeToReservasDaData } from '../../services/queries/entradasQueries';
import { STATUS_RESERVA, configDaData, ehVendaDeEntrada, resumirEntradasPorDia } from '../../utils/entradas';
import { vendaValida } from '../../utils/financeiro';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import {
  Grade,
  GradeItem,
  Rotulo,
  Valor,
  TextoSuave,
  BotaoPrincipal,
  BotaoPrincipalTexto,
  BotaoSecundario,
  BotaoSecundarioTexto,
} from './entradasStyle';

// Aba "Entradas/Ingressos" do PDV: registra a entrada do mesmo jeito que a
// Portaria (pessoas × valor do dia). As reservas ficam na tela Portaria.
export default function PainelEntradaPDV({ usuario, operacaoId, podeDarCortesia }) {
  const router = useRouter();
  const { vendasHoje } = useVendas();
  const hojeISO = paraDataISOLocal();
  const [config, setConfig] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);

  useEffect(() => subscribeToConfigEntradas(setConfig), []);
  useEffect(() => subscribeToReservasDaData(hojeISO, setReservas), [hojeISO]);

  if (!config) return <ActivityIndicator color="#1A1A1A" style={{ marginVertical: 24 }} />;

  const { valor } = configDaData(config, hojeISO);
  const { totais } = resumirEntradasPorDia(vendasHoje.filter((v) => ehVendaDeEntrada(v) && vendaValida(v)));
  const aChegar = reservas
    .filter((r) => r.status === STATUS_RESERVA.RESERVADA)
    .reduce((soma, r) => soma + r.quantidade, 0);

  return (
    <>
      <Grade style={{ marginTop: 4 }}>
        <GradeItem bg="#FFD000">
          <Rotulo cor="#1A1A1A">Valor hoje</Rotulo>
          <Valor>{formatPrice(valor)}</Valor>
        </GradeItem>
        <GradeItem>
          <Rotulo>Entraram hoje</Rotulo>
          <Valor>{totais.pessoas}</Valor>
          <TextoSuave>{formatPrice(totais.total)}</TextoSuave>
        </GradeItem>
        <GradeItem>
          <Rotulo>Reservas</Rotulo>
          <Valor>{aChegar}</Valor>
          <TextoSuave>a chegar</TextoSuave>
        </GradeItem>
      </Grade>

      <BotaoPrincipal onPress={() => setModalVisivel(true)}>
        <Ionicons name="add-circle-outline" size={20} color="#1A1A1A" />
        <BotaoPrincipalTexto>Registrar entrada</BotaoPrincipalTexto>
      </BotaoPrincipal>

      {aChegar > 0 && (
        <BotaoSecundario onPress={() => router.push('/portaria')} style={{ alignSelf: 'center' }}>
          <Ionicons name="people-outline" size={14} color="#1A1A1A" />
          <BotaoSecundarioTexto>Ver reservas na portaria</BotaoSecundarioTexto>
        </BotaoSecundario>
      )}

      <RegistrarEntradaPortariaModal
        visivel={modalVisivel}
        reserva={null}
        valorDoDia={valor}
        podeDarCortesia={podeDarCortesia}
        usuario={usuario}
        operacaoId={operacaoId}
        onFechar={() => setModalVisivel(false)}
      />
    </>
  );
}
