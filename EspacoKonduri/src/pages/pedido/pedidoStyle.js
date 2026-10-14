import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
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
  border-width: 1.5px;
  border-color: ${(props) =>
    props.status === 'pendente'
      ? '#8A6A00'
      : props.status === 'cancelado'
      ? '#C0392B'
      : '#E6E6E0'};
  opacity: ${(props) => (props.status === 'cancelado' ? 0.7 : 1)};
`;

export const PedidoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const ClienteNome = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const PedidoHora = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const StatusBadge = styled.View`
  background-color: ${(props) => STATUS_CORES[props.status]?.bg || '#F1F1EB'};
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 10px;
`;

export const StatusBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => STATUS_CORES[props.status]?.text || '#6B6B6B'};
`;

export const STATUS_CORES = {
  pendente: { bg: '#FFF7D1', text: '#6B5300' },
  aceito: { bg: '#E8F4FD', text: '#1A73C0' },
  preparando: { bg: '#FFF7D1', text: '#6B5300' },
  pronto: { bg: '#E6F4EA', text: '#2E5A1E' },
  cancelado: { bg: '#FDEDEC', text: '#C0392B' }, // ← adiciona essa linha
};

export const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 4px;
`;

export const ItemImage = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #F1F1EB;
  margin-right: 10px;
`;

export const ItemImagePlaceholder = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #F1F1EB;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
`;

export const ItemName = styled.Text`
  font-size: 13px;
  color: #1A1A1A;
  flex: 1;
`;

export const ItemQtyPrice = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #6B6B6B;
`;

export const ObservacaoBox = styled.View`
  flex-direction: row;
  background-color: #FFF7D1;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 10px;
  align-items: flex-start;
`;

export const ObservacaoText = styled.Text`
  flex: 1;
  font-size: 12px;
  color: #6B5300;
  margin-left: 8px;
  font-style: italic;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  margin-top: 10px;
  border-top-width: 1px;
  border-top-color: #F1F1EB;
`;

export const TotalLabel = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #6B5300;
`;

export const PagamentoRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.pago ? '#E6F4EA' : '#FDEDEC')};
  border-radius: 10px;
  padding: 8px 12px;
  margin-top: 10px;
`;

export const PagamentoText = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.pago ? '#2E5A1E' : '#C0392B')};
  margin-left: 6px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.variant === 'danger' ? '#FDEDEC' : '#FFD000')};
  border-radius: 10px;
  padding-vertical: 10px;
  margin-right: ${(props) => (props.marginRight ? '8px' : '0px')};
`;

export const ActionButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.variant === 'danger' ? '#C0392B' : '#1A1A1A')};
  margin-left: 6px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

export const EmptyTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 16px;
  text-align: center;
`;

export const EmptySubtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-top: 8px;
  text-align: center;
`;

export const SwipeDeleteContainer = styled.View`
  background-color: #C0392B;
  border-radius: 16px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 24px;
  margin-bottom: 14px;
`;

export const SwipeDeleteText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
  font-size: 13px;
  margin-top: 4px;
`;

export const ClearAllButton = styled.TouchableOpacity`
  padding: 6px 10px;
`;

export const ClearAllButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #C0392B;
`;

export const ClienteAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 8px;
`;

export const ClienteAvatarPlaceholder = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #F1F1EB;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

export const ClienteInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;