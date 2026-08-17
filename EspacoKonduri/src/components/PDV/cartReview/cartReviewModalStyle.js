import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const ModalContent = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 75%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3D2C22;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const ItemImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: #F0EAE1;
  margin-right: 12px;
`;

export const ItemInfo = styled.View`
  flex: 1;
`;

export const ItemTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ItemPrice = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 2px;
`;

export const ItemQtyControls = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FAF0E6;
  border-radius: 14px;
  padding: 2px;
  margin-right: 10px;
`;

export const QtyButton = styled.TouchableOpacity`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
`;

export const QtyText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-horizontal: 8px;
  min-width: 16px;
  text-align: center;
`;

export const RemoveButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const ItemSubtotal = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #D35400;
  min-width: 70px;
  text-align: right;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 8px;
`;

export const TotalLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const TotalValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #D35400;
`;

export const ProceedButton = styled.TouchableOpacity`
  background-color: #3D2C22;
  border-radius: 12px;
  height: 52px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

export const ProceedButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
`;