import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
  padding-horizontal: 20px;
`;

export const FinalizeButton = styled.TouchableOpacity`
  background-color: #FFD000;
  border-radius: 14px;
  height: 56px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  elevation: 3;
`;

export const FinalizeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1A1A1A;
  letter-spacing: 0.5px;
  margin-left: 8px;
`;

export const ItemsSummaryCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #E6E6E0;
`;

export const ItemsSummaryTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #6B6B6B;
  letter-spacing: 0.3px;
  margin-bottom: 10px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 5px;
`;

export const ItemName = styled.Text`
  font-size: 13px;
  color: #1A1A1A;
  flex: 1;
`;

export const ItemQtyPrice = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #6B6B6B;
`;

export const QrCodeCard = styled.View`
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6E6E0;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
  align-items: center;
`;

export const QrCodeLoadingText = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-top: 10px;
`;

export const QrCodeImage = styled.Image`
  width: 200px;
  height: 200px;
  margin-bottom: 14px;
`;

export const QrCodeCopyRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #6B5300;
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 4px;
`;

export const QrCodeCopyText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 6px;
`;

export const QrCodeStatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 14px;
  width: 100%;
  justify-content: center;
`;

export const QrCodeStatusText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #6B5300;
  margin-left: 8px;
`;

export const QrCodePaidBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #E6F4EA;
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 14px;
  width: 100%;
  justify-content: center;
`;

export const QrCodePaidText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 8px;
`;

export const QrCodeErrorBox = styled.View`
  background-color: #FDEDEC;
  border-radius: 10px;
  padding: 12px 14px;
  width: 100%;
  align-items: center;
`;

export const QrCodeErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  text-align: center;
  margin-bottom: 8px;
`;

export const RetryButton = styled.TouchableOpacity`
  padding: 6px 12px;
`;

export const RetryButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8A6A00;
`;

export const MaquininhaCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-width: 1px;
  border-color: #F2DC7C;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

export const MaquininhaText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #6B5300;
  margin-left: 10px;
`;