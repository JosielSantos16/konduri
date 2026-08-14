import styled from 'styled-components/native';

export const ProductCard = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16px;
  margin: 6px;
  padding: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const ProductImage = styled.Image`
  width: 100%;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 8px;
  background-color: #F0EAE1; 
`;

export const ProductTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 4px;
`;

export const ProductFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

export const ProductPrice = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #D35400;
`;

export const CartBadge = styled.View`
  background-color: #E67E22;
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 8px;
`;

export const CartBadgeText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #FAF0E6;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
`;

export const QtyControls = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const QtyButton = styled.TouchableOpacity`
  background-color: #FAF0E6;
  width: 24px;
  height: 24px;
  border-radius: 12px;
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