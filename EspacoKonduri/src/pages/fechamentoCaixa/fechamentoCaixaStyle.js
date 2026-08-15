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
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitles = styled.View``;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const HeaderDate = styled.Text`
  font-size: 13px;
  color: #D35400;
  font-weight: bold;
`;

export const TotaisCard = styled.View`
  background-color: #1E4A3D;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
`;

export const TotaisHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.15);
`;

export const TotaisHeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TotaisTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
`;

export const TotaisBadge = styled.Text`
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  font-weight: bold;
`;

export const TotaisRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const TotaisLabel = styled.Text`
  font-size: 14px;
  color: rgba(255,255,255,0.85);
`;

export const TotaisValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const CardTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #8C7355;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FAF8F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding-horizontal: 14px;
  height: 50px;
`;

export const InputText = styled.Text`
  font-size: 15px;
  color: #3D2C22;
  font-weight: bold;
`;

export const FinalizeButton = styled.TouchableOpacity`
  background-color: #D35400;
  border-radius: 12px;
  height: 54px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 30px;
`;

export const FinalizeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  margin-left: 8px;
`;

export const ErrorBox = styled.View`
  background-color: #FDEDEC;
  border-width: 1px;
  border-color: #F5B7B1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
`;

export const ErrorText = styled.Text`
  color: #C0392B;
  font-size: 13px;
  text-align: center;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;