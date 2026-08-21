import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

export const IconCircle = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #FDEBD3;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #3D2C22;
  text-align: center;
  margin-bottom: 10px;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: #8C7355;
  text-align: center;
  line-height: 20px;
  margin-bottom: 8px;
`;

export const EmailText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #E67E22;
  text-align: center;
  margin-bottom: 30px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 12px;
  height: 52px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const PrimaryButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  height: 44px;
  justify-content: center;
  align-items: center;
`;

export const SecondaryButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #8C7355;
`;

export const LogoutText = styled.Text`
  font-size: 13px;
  color: #C0392B;
  margin-top: 20px;
`;

export const SpamNotice = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: #FFF8E7;
  border-width: 1px;
  border-color: #F0D9A0;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 12px;
  margin-bottom: 8px;
  width: 100%;
`;

export const SpamNoticeText = styled.Text`
  flex: 1;
  font-size: 12px;
  color: #8C5A2E;
  margin-left: 8px;
  line-height: 17px;
`;

export const SpamNoticeTextBold = styled.Text`
  font-weight: bold;
`;