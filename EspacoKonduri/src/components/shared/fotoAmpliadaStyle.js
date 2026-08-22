import styled from 'styled-components/native';

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.9);
  justify-content: center;
  align-items: center;
`;

export const FotoGrande = styled.Image`
  width: 320px;
  height: 320px;
  border-radius: 16px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  justify-content: center;
  align-items: center;
`;