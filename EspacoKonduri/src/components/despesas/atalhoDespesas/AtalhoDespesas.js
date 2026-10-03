import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Atalho, IconeBox, Textos, Titulo, Subtitulo } from './atalhoDespesasStyle';

// Entrada para Custos e Despesas dentro da aba Controle (abertura e controle do dia)
export default function AtalhoDespesas({ style }) {
  const router = useRouter();

  return (
    <Atalho style={style} activeOpacity={0.8} onPress={() => router.push('/despesas')}>
      <IconeBox>
        <Ionicons name="wallet-outline" size={20} color="#D35400" />
      </IconeBox>
      <Textos>
        <Titulo>Custos e Despesas</Titulo>
        <Subtitulo>Aluguel, energia, funcionários, taxas...</Subtitulo>
      </Textos>
      <Ionicons name="chevron-forward" size={20} color="#A99B8F" />
    </Atalho>
  );
}
