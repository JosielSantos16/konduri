import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const UserInfo = styled.View`
  flex-direction: column;
`;

export const UserName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const UserRole = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const HeaderRight = styled.View`
  align-items: flex-end;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #E6F4EA;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 12px;
  margin-bottom: 6px;
`;

export const StatusDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #34A853;
  margin-right: 6px;
`;

export const StatusText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #137333;
`;

export const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

export const TabContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  margin-bottom: 15px;
`;

export const TabButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.active ? '#E67E22' : '#FFFFFF')};
  padding-vertical: 10px;
  padding-horizontal: 18px;
  border-radius: 20px;
  margin-right: 10px;
  border-width: ${props => (props.active ? '0px' : '1px')};
  border-color: #E6DFD5;
  elevation: ${props => (props.active ? 2 : 0)};
`;

export const TabText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${props => (props.active ? '#FFFFFF' : '#8C7355')};
  margin-left: 6px;
`;

export const ProductList = styled.FlatList`
  flex: 1;
  padding-horizontal: 15px;
`;

export const ProductCard = styled.TouchableOpacity`
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

export const AddButton = styled.View`
  background-color: #FAF0E6;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
`;

export const CartBar = styled.View`
  background-color: #FFFFFF;
  padding: 16px 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-top-width: 1px;
  border-top-color: #E6DFD5;
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