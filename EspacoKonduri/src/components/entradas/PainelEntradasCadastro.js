import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { subscribeToConfigEntradas } from '../../services/queries/entradasQueries';
import { configDaData } from '../../utils/entradas';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import {
  Card,
  CardTitulo,
  Linha,
  Rotulo,
  Valor,
  TextoSuave,
  BotaoPrincipal,
  BotaoPrincipalTexto,
  BotaoSecundario,
  BotaoSecundarioTexto,
} from './entradasStyle';

// Aparece no cadastro de produto quando se escolhe "Vender como: Ingresso".
// Entrada não é produto (não tem estoque nem custo): o valor e a lotação ficam
// na tela Entradas, e a venda é feita na Portaria ou na aba de entradas do PDV.
export default function PainelEntradasCadastro() {
  const router = useRouter();
  const [config, setConfig] = useState(null);

  useEffect(() => subscribeToConfigEntradas(setConfig), []);

  if (!config) return <ActivityIndicator color="#1A1A1A" style={{ marginVertical: 24 }} />;

  const { valor, lotacao } = configDaData(config, paraDataISOLocal());

  return (
    <Card>
      <CardTitulo>ENTRADAS DO ESPAÇO KONDURI</CardTitulo>
      <Linha>
        <Rotulo>Valor hoje, por pessoa</Rotulo>
        <Valor>{formatPrice(valor)}</Valor>
      </Linha>
      <Linha>
        <Rotulo>Lotação hoje</Rotulo>
        <Valor>{lotacao === null ? 'Sem limite' : `${lotacao} pessoas`}</Valor>
      </Linha>
      <TextoSuave style={{ marginTop: 6 }}>
        A entrada não é cadastrada como produto: não tem estoque nem custo. O valor e a lotação são
        definidos na tela Entradas, e a venda é feita na Portaria ou na aba Entradas/Ingressos do PDV.
      </TextoSuave>

      <BotaoPrincipal onPress={() => router.push('/entradas')} style={{ marginTop: 14, marginBottom: 10 }}>
        <Ionicons name="settings-outline" size={18} color="#1A1A1A" />
        <BotaoPrincipalTexto>Valores, lotação e relatório</BotaoPrincipalTexto>
      </BotaoPrincipal>
      <BotaoSecundario onPress={() => router.push('/portaria')} style={{ alignSelf: 'center' }}>
        <Ionicons name="ticket-outline" size={14} color="#1A1A1A" />
        <BotaoSecundarioTexto>Abrir portaria</BotaoSecundarioTexto>
      </BotaoSecundario>
    </Card>
  );
}
