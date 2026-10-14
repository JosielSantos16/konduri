import styled from 'styled-components/native';

export const Overlay = styled.KeyboardAvoidingView`
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
  margin-bottom: 4px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const ProdutoNome = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6px;
`;

export const Input = styled.TextInput`
  background-color: #FAFAF7;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => (props.hasError ? '#C0392B' : '#E6E6E0')};
  padding: 12px 14px;
  font-size: 14px;
  color: #1A1A1A;
  margin-bottom: 4px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-bottom: 8px;
`;

export const Campo = styled.View`
  margin-bottom: 10px;
`;

export const PreviewBox = styled.View`
  background-color: #FFF7D1;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 16px;
`;

export const PreviewRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const PreviewLabel = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
`;

export const PreviewValue = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #FFD000;
  border-radius: 12px;
  height: 48px;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

export const SaveButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
`;
