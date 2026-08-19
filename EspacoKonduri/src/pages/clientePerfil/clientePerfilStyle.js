import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  align-items: center;
  padding-top: 30px;
  padding-bottom: 24px;
`;

export const Avatar = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #FDEBD3;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
`;

export const Nome = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Cargo = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 4px;
`;

export const InfoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const InfoRowLast = styled(InfoRow)`
  border-bottom-width: 0;
`;

export const InfoTextGroup = styled.View`
  margin-left: 12px;
`;

export const InfoLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #A99B8F;
  letter-spacing: 0.3px;
`;

export const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-top: 2px;
`;

export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1.5px;
  border-color: #C0392B;
  border-radius: 12px;
  height: 52px;
  margin-bottom: 20px;
`;

export const LogoutButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;