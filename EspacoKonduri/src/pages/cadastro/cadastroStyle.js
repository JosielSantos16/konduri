import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #FAFAF7;
  justify-content: center;
  padding: 24px;
`;

export const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

export const LogoImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  border-width: 2px;
  border-color: #1A1A1A;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #1A1A1A;
  text-align: center;
  letter-spacing: 1px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #5E5E5E;
  text-align: center;
  margin-bottom: 25px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#C0392B' : '#E6E6E0')};
  padding-horizontal: 14px;
  height: 52px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #1A1A1A;
`;

export const EyeButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 6px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const CreateButton = styled.TouchableOpacity`
  background-color: #1A1A1A;
  border-radius: 12px;
  height: 52px;
  justify-content: center;
  align-items: center;
`;

export const CreateButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
`;

export const GeneralErrorBox = styled.View`
  background-color: #FDEDEC;
  border-width: 1px;
  border-color: #F5B7B1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 14px;
`;

export const GeneralErrorText = styled.Text`
  color: #C0392B;
  font-size: 13px;
  text-align: center;
`;