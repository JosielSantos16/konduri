import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { subscribeToConfigEntradas } from '../../services/queries/entradasQueries';
import { configDaData } from '../../utils/entradas';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { Banner, BannerIcone, BannerTitulo, BannerTexto } from './entradasStyle';

// Atalho na tela inicial do cliente: reservar a entrada antes de sair da cidade
export default function BannerEntrada() {
  const router = useRouter();
  const [config, setConfig] = useState(null);

  useEffect(() => subscribeToConfigEntradas(setConfig), []);

  const valorHoje = config ? configDaData(config, paraDataISOLocal()).valor : null;

  return (
    <Banner activeOpacity={0.85} onPress={() => router.push('/reservar-entrada')}>
      <BannerIcone>
        <Ionicons name="ticket-outline" size={22} color="#1A1A1A" />
      </BannerIcone>
      <BannerTitulo style={{ flex: 1 }}>
        Reserve sua entrada
        {'\n'}
        <BannerTexto>
          {valorHoje !== null ? `Hoje: ${formatPrice(valorHoje)} por pessoa · pague na portaria` : 'Pague na portaria'}
        </BannerTexto>
      </BannerTitulo>
      <Ionicons name="chevron-forward" size={20} color="#FFD000" />
    </Banner>
  );
}
