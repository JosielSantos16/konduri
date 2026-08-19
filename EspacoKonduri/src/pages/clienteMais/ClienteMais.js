import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import NavBarCliente from '../../components/cliente/navBar/NavBarCliente';

const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
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
  color: #3D2C22;
  margin-top: 16px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 8px;
  text-align: center;
`;

export default function ClienteMais() {
  const insets = useSafeAreaInsets();

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Content>
        <Ionicons name="sparkles-outline" size={48} color="#C9BBA8" />
        <Title>Em breve</Title>
        <Subtitle>Estamos preparando uma novidade especial pra essa área.</Subtitle>
      </Content>

      <NavBarCliente />
    </Container>
  );
}