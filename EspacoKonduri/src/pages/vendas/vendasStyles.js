import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const HeaderTopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-bottom: 15px;
`;

export const SearchIconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6E6E0;
  justify-content: center;
  align-items: center;
`;

export const InlineSearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding-horizontal: 14px;
  height: 44px;
  margin-bottom: 10px;
`;
export const InlineSearchInput = styled.TextInput`
  flex: 1;
  font-size: 13px;
  color: #1A1A1A;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6E6E0;
  border-radius: 12px;
  padding-horizontal: 14px;
  height: 44px;
  margin-bottom: 10px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const DateFilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6E6E0;
  border-radius: 12px;
  padding: 8px 12px;
`;

export const DateFilterText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 6px;
  margin-right: 6px;
`;

export const TotalRecordsText = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  font-weight: bold;
`;
export const TodayButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color:  #1A1A1A;
  border-radius: 12px;
  padding-horizontal: 14px;
  height: 40px;
  margin-left: 10px;
  elevation: 2;
`;

export const TodayButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 6px;
`;

export const OrderToggleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
`;

export const OrderToggleText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #6B6B6B;
  margin-left: 4px;
`;

export const PaymentFilterRow = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

export const PaymentChip = styled.TouchableOpacity`
  background-color: ${(props) => (props.active ? '#FFD000' : '#F1F1EB')};
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 14px;
  margin-right: 8px;
`;

export const PaymentChipText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.active ? '#1A1A1A' : '#6B6B6B')};
`;

export const AtendenteResumoSection = styled.View`
  padding-horizontal: 20px;
  margin-bottom: 12px;
`;

export const AtendenteResumoRow = styled.View`
  flex-direction: row;
`;

export const AtendenteResumoCard = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 10px 12px;
  margin-right: 8px;
  border-width: 1px;
  border-color: #E6E6E0;
`;

export const AtendenteResumoNome = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #6B6B6B;
`;

export const AtendenteResumoValor = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 2px;
`;

export const ClosedOperationBanner = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-horizontal: 20px;
  margin-bottom: 12px;
`;

export const ClosedOperationText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: #6B5300;
  margin-left: 8px;
`;

export const SalesList = styled.FlatList`
  padding-horizontal: 20px;
`;

export const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #6B6B6B;
  text-align: center;
  margin-top: 12px;
`;

export const ComissaoSection = styled.View`
  padding-horizontal: 20px;
  margin-top: 4px;
  margin-bottom: 14px;
`;

export const ComissaoSectionTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
`;

export const ComissaoButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #1A1A1A;
  border-radius: 12px;
  padding-horizontal: 14px;
  height: 40px;
  elevation: 2;
`;

export const ComissaoButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 6px;
`;

export const ComissaoBadge = styled.View`
  background-color: #FFD000;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
`;

export const ComissaoBadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const ComissaoModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const ComissaoModalContent = styled.View`
  background-color: #FAFAF7;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 75%;
`;

export const ComissaoModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ComissaoModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const ComissaoModalCloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ComissaoModalSubtitle = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-bottom: 16px;
`;

export const ComissaoModalEmptyText = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  text-align: center;
  padding-vertical: 20px;
`;