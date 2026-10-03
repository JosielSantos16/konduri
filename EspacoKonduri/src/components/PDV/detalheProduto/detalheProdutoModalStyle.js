import styled from 'styled-components/native';

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

export const Content = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 340px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
`;

export const ImagemGrande = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 14px;
  background-color: #F0EAE1;
  margin-bottom: 16px;
`;

export const ImagemPlaceholder = styled.View`
  width: 100%;
  height: 180px;
  border-radius: 14px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

export const Titulo = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 4px;
`;

export const Preco = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #D35400;
  margin-bottom: 16px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 8px;
  border-top-width: 1px;
  border-top-color: #F0EAE1;
`;

export const InfoLabel = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const InfoValue = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Observacoes = styled.Text`
  font-size: 12px;
  color: #8C5A2E;
  margin-top: 12px;
  font-style: italic;
`;