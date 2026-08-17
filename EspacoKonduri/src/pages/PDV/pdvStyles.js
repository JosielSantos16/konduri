import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ProductList = styled.FlatList`
  flex: 1;
  padding-horizontal: 15px;
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
  margin-horizontal: 20px;
  margin-bottom: 15px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #3D2C22;
  margin-left: 8px;
`;

export const ClearSearchButton = styled.TouchableOpacity`
  padding: 4px;
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

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ClosedBanner = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FDEDEC;
  border-width: 1px;
  border-color: #F5B7B1;
  border-radius: 12px;
  padding: 12px 14px;
  margin-horizontal: 20px;
  margin-bottom: 15px;
`;

export const ClosedBannerText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 8px;
`;

export const SummaryButton = styled.TouchableOpacity`
  margin-left: 10px;
`;