import styled from 'styled-components/native';

// Mesmo visual do modal de entrada, mais o seletor de tipo de saída
export * from '../registrarEntrada/registrarEntradaModalStyle';

export const TipoOptions = styled.View`
  flex-direction: row;
  background-color: #F0EAE1;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 14px;
`;

export const TipoButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 9px;
  border-radius: 9px;
  align-items: center;
  background-color: ${(props) => (props.active ? '#FFFFFF' : 'transparent')};
`;

export const TipoButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.active ? '#E67E22' : '#8C7355')};
`;

export const DescricaoTipo = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-bottom: 14px;
`;
