import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  padding: 24px;
`;

export const Content = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Input = styled.TextInput`
  background-color: #FAFAF7;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 12px 14px;
  font-size: 14px;
  color: #1A1A1A;
  min-height: 90px;
  text-align-vertical: top;
  margin-bottom: 16px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #FFD000;
  border-radius: 12px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

export const SaveButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
`;