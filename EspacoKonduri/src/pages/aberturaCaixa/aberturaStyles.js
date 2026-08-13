import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ScrollContainer = styled.ScrollView`
  padding: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LogoCircle = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #0A3A2A;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const BrandTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #0A3A2A;
`;

export const NotificationButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F0F4F1;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #DDE5E0;
`;

export const MainTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #0A3A2A;
  margin-bottom: 6px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B7C73;
  margin-bottom: 20px;
  line-height: 18px;
`;

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  border-width: 1px;
  border-color: #E2EBE5;
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
  color: #0A3A2A;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #6B7C73;
  margin-bottom: 6px;
  letter-spacing: 0.8px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FAF8F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E2EBE5;
  padding-horizontal: 14px;
  height: 50px;
`;

export const InputText = styled.Text`
  font-size: 14px;
  color: #0A3A2A;
  font-weight: 500;
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #0A3A2A;
`;

export const AlertBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FDF3F0;
  border-radius: 14px;
  padding: 14px;
  border-width: 1px;
  border-color: #FADBD8;
  margin-bottom: 25px;
`;

export const AlertText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #B03A2E;
  margin-left: 10px;
  line-height: 18px;
`;

export const StartButton = styled.TouchableOpacity`
  background-color: #0A3A2A;
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