import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVendas } from '../../contexts/VendasContext';
import { subscribeToReservasDaData } from '../../services/queries/entradasQueries';
import { STATUS_RESERVA, ehVendaDeEntrada, resumirEntradasPorDia } from '../../utils/entradas';
import { vendaValida } from '../../utils/financeiro';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { Banner, BannerIcone, BannerTitulo, BannerTexto } from './entradasStyle';

// Resumo das entradas de hoje no Painel do admin; abre a tela de Entradas
export default function AtalhoEntradasPainel() {
  const router = useRouter();
  const { vendasHoje } = useVendas();
  const hojeISO = paraDataISOLocal();
  const [reservas, setReservas] = useState([]);

  useEffect(() => subscribeToReservasDaData(hojeISO, setReservas), [hojeISO]);

  const { totais } = resumirEntradasPorDia(vendasHoje.filter((v) => ehVendaDeEntrada(v) && vendaValida(v)));
  const aChegar = reservas
    .filter((r) => r.status === STATUS_RESERVA.RESERVADA)
    .reduce((soma, r) => soma + r.quantidade, 0);

  return (
    <Banner activeOpacity={0.85} onPress={() => router.push('/entradas')}>
      <BannerIcone>
        <Ionicons name="ticket-outline" size={22} color="#1A1A1A" />
      </BannerIcone>
      <BannerTitulo style={{ flex: 1 }}>
        Entradas hoje: {totais.pessoas} {totais.pessoas === 1 ? 'pessoa' : 'pessoas'}
        {'\n'}
        <BannerTexto>
          {formatPrice(totais.total)}
          {totais.cortesias > 0 ? ` · ${totais.cortesias} cortesia(s)` : ''} · {aChegar} com reserva a chegar
        </BannerTexto>
      </BannerTitulo>
      <Ionicons name="chevron-forward" size={20} color="#FFD000" />
    </Banner>
  );
}
