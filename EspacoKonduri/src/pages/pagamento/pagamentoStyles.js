import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
  padding-horizontal: 20px;
`;

export const FinalizeButton = styled.TouchableOpacity`
  background-color: #E67E22;
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
  color: #FFFFFF;
  letter-spacing: 0.5px;
  margin-left: 8px;
`;

export const ItemsSummaryCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const ItemsSummaryTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #8C7355;
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
  color: #3D2C22;
  flex: 1;
`;

export const ItemQtyPrice = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
`;

export const PixKeyCard = styled.View`
  background-color: #FFF8E7;
  border-width: 1px;
  border-color: #F0D9A0;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

export const PixKeyLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #B85D00;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
`;

export const PixKeyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PixKeyValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  flex: 1;
`;

export const CopyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #8C5A2E;
  border-radius: 8px;
  padding-horizontal: 10px;
  padding-vertical: 6px;
  margin-left: 10px;
`;

export const CopyButtonText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 4px;
`;

export const PixNoticeText = styled.Text`
  font-size: 10px;
  color: #A9895C;
  margin-top: 8px;
`;