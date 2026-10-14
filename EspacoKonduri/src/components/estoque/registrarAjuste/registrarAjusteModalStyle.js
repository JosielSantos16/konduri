import styled from 'styled-components/native';

// Mesmo visual do modal de entrada, mais o seletor de tipo de saída
export * from '../registrarEntrada/registrarEntradaModalStyle';

export const TipoOptions = styled.View`
  flex-direction: row;
  background-color: #F1F1EB;
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
  color: ${(props) => (props.active ? '#8A6A00' : '#6B6B6B')};
`;

export const DescricaoTipo = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-bottom: 14px;
`;
