import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #FAF8F5;
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
  border-color: #2E5A1E;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #3D2C22;
  text-align: center;
  letter-spacing: 1px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #7A6555;
  text-align: center;
  margin-bottom: 25px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #5C4033;
  margin-bottom: 6px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#C0392B' : '#E6DFD5')};
  padding-horizontal: 14px;
  height: 52px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #3D2C22;
`;

export const EyeButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 6px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 20px;
`;

export const ForgotPasswordText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #D35400;
`;

export const EnterButton = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: #3D2C22;
  border-radius: 12px;
  height: 52px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: transparent;
`;

export const EnterButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
  letter-spacing: 0.5px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
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