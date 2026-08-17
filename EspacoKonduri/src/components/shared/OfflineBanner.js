import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import styled from 'styled-components/native';

const Banner = styled.View`
  background-color: #C0392B;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 8px;
`;

const BannerText = styled.Text`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  margin-left: 6px;
`;

export default function OfflineBanner() {
  const conectado = useNetworkStatus();

  if (conectado) return null;

  return (
    <Banner>
      <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
      <BannerText>Sem conexão — os dados podem estar desatualizados</BannerText>
    </Banner>
  );
}