import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const ScrollContainer = styled.ScrollView`
  padding: 20px;
`;

export const MainTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 60px;
  margin-bottom: 6px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-bottom: 20px;
  line-height: 18px;
`;

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  border-width: 1px;
  border-color: #E6E6E0;
  margin-bottom: 16px;
  elevation: 1;
`;

export const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 18px;
`;

export const CardSectionTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #6B6B6B;
  margin-bottom: 6px;
  letter-spacing: 0.8px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FAFAF7;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding-horizontal: 14px;
  height: 50px;
`;

export const InputText = styled.Text`
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #1A1A1A;
`;

export const AlertBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-radius: 14px;
  padding: 14px;
  border-width: 1px;
  border-color: #F2DC7C;
  margin-bottom: 25px;
`;

export const AlertText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #6B5300;
  margin-left: 10px;
  line-height: 18px;
`;

export const StartButton = styled.TouchableOpacity`
  background-color: #1A1A1A;
  border-radius: 14px;
  height: 56px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  elevation: 3;
  margin-bottom: 20px;
`;

export const StartButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-right: 8px;
  letter-spacing: 0.5px;
`;