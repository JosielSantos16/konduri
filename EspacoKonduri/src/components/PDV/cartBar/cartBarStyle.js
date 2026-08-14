import styled from 'styled-components/native';

export const CartBar = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px 20px 40px 20px;
  margin-bottom: -20px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 10;
`;

export const CartBarInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CartItemsText = styled.Text`
  font-size: 14px;
  color: #7A6555;
`;

export const CartTotalText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #D35400;
`;

export const FinalizeButton = styled.TouchableOpacity`
  background-color: #3D2C22;
  border-radius: 12px;
  height: 52px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const FinalizeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
`;