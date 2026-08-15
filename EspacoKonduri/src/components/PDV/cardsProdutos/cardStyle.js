import styled from 'styled-components/native';

export const ProductCard = styled.View`
  width: 48%;
  background-color: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
  overflow: hidden;
`;

export const ProductImage = styled.Image`
  width: 100%;
  height: 110px;
  background-color: #F0EAE1;
`;

export const CardContent = styled.View`
  padding: 10px;
`;

export const ProductTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 6px;
`;

export const ProductFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  width: 28px;
  height: 28px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
`;

export const QtyControls = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FAF0E6;
  border-radius: 14px;
  padding: 2px;
`;

export const QtyButton = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

export const QtyText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-horizontal: 6px;
  min-width: 14px;
  text-align: center;
`;