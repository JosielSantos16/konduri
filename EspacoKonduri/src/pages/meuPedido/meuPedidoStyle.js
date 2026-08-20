import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 2px;
`;

export const List = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const PedidoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const PedidoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PedidoData = styled.Text`
  font-size: 12px;
  color: #8C7355;
`;

export const StatusBadge = styled.View`
  background-color: ${(props) => STATUS_CORES[props.status]?.bg || '#F0EAE1'};
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 10px;
`;

export const StatusBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => STATUS_CORES[props.status]?.text || '#8C7355'};
`;

export const STATUS_CORES = {
  pendente: { bg: '#FDF3E7', text: '#B85D00' },
  aceito: { bg: '#E8F4FD', text: '#1A73C0' },
  preparando: { bg: '#FDEBD3', text: '#D35400' },
  pronto: { bg: '#E6F4EA', text: '#2E5A1E' },
  entregue: { bg: '#F0EAE1', text: '#8C7355' },
  cancelado: { bg: '#FDEDEC', text: '#C0392B' },
};

export const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 4px;
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

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  margin-top: 8px;
  border-top-width: 1px;
  border-top-color: #F0EAE1;
`;

export const TotalLabel = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
`;

export const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #D35400;
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

export const CancelButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #C0392B;
  border-radius: 10px;
  padding-vertical: 8px;
  margin-top: 10px;
`;

export const CancelButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 6px;
`;

export const PagamentoBadge = styled.View`
  background-color: ${(props) => (props.pago ? '#E6F4EA' : '#FDEDEC')};
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
`;

export const PagamentoBadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: ${(props) => (props.pago ? '#2E5A1E' : '#C0392B')};
  margin-left: 4px;
`;

export const ItemImage = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #F0EAE1;
  margin-right: 10px;
`;

export const ItemImagePlaceholder = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #F0EAE1;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
`;

export const RefazerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #E67E22;
  border-radius: 10px;
  padding-vertical: 10px;
  margin-top: 10px;
`;

export const RefazerButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 6px;
`;