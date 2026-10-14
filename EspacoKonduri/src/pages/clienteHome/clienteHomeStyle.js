import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const HeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #FFF7D1;
  margin-right: 10px;
`;

export const AvatarPlaceholder = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #FFF7D1;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
`;

export const Greeting = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.aberto ? '#E6F4EA' : '#FDEDEC')};
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 12px;
`;

export const StatusDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${(props) => (props.aberto ? '#34A853' : '#C0392B')};
  margin-right: 5px;
`;

export const StatusText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => (props.aberto ? '#137333' : '#C0392B')};
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding-horizontal: 14px;
  height: 46px;
  margin-top: 16px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #1A1A1A;
  margin-left: 8px;
`;

export const ClosedOperationBanner = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-horizontal: 20px;
  margin-bottom: 10px;
`;

export const ClosedOperationText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: #6B5300;
  margin-left: 8px;
`;

export const PedidoAtivoBanner = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #E8F4FD;
  border-radius: 10px;
  padding: 10px 14px;
  margin-horizontal: 20px;
  margin-bottom: 10px;
`;

export const PedidoAtivoText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: #1A73C0;
  margin-left: 8px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  margin-bottom: 8px;
  margin-top: 4px;
`;

export const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #6B6B6B;
  letter-spacing: 0.3px;
`;

export const SortRow = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  margin-bottom: 12px;
`;

export const SortChip = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.active ? '#FFD000' : '#F1F1EB')};
  padding-horizontal: 10px;
  padding-vertical: 6px;
  border-radius: 12px;
  margin-right: 8px;
`;

export const SortChipText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => (props.active ? '#1A1A1A' : '#6B6B6B')};
  margin-left: 4px;
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
  color: #6B6B6B;
  text-align: center;
  margin-top: 10px;
`;