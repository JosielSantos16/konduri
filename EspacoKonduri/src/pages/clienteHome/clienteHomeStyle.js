import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const HeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Greeting = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 2px;
`;

export const LogoutButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6DFD5;
  justify-content: center;
  align-items: center;
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding-horizontal: 14px;
  height: 46px;
  margin-top: 16px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #3D2C22;
  margin-left: 8px;
`;

export const ProductGrid = styled.FlatList`
  flex: 1;
  padding-horizontal: 15px;
`;

export const EmptyState = styled.View`
  align-items: center;
  padding: 60px 20px;
`;

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #8C7355;
  text-align: center;
  margin-top: 10px;
`;

export const MeuPedidoButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 66px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #E67E22;
  justify-content: center;
  align-items: center;
`;

export const MeuPedidoBadge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #C0392B;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const MeuPedidoBadgeText = styled.Text`
  font-size: 9px;
  font-weight: bold;
  color: #FFFFFF;
`;