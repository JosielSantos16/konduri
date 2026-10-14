import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import NavBarCliente from '../../components/cliente/navBar/NavBarCliente';

const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 16px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-top: 8px;
  text-align: center;
`;

export default function ClienteMais() {
  const insets = useSafeAreaInsets();

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Content>
        <Ionicons name="sparkles-outline" size={48} color="#C4C4BE" />
        <Title>Em breve</Title>
        <Subtitle>Estamos preparando uma novidade especial pra essa área.</Subtitle>
      </Content>

      <NavBarCliente />
    </Container>
  );
}