import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBarAtendente from '../../components/PDV/navBar/navBarAtendente';
import { Container, Content, Title, Subtitle } from './pedidoStyle';

export default function Pedido() {
  const insets = useSafeAreaInsets();

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Content>
        <Ionicons name="construct-outline" size={48} color="#C9BBA8" />
        <Title>Pedidos Remotos em Construção</Title>
        <Subtitle>
          Em breve, os clientes poderão fazer pedidos direto pelo próprio app, e eles
          aparecerão aqui para você acompanhar e preparar.
        </Subtitle>
      </Content>

      <NavBarAtendente />
    </Container>
  );
}