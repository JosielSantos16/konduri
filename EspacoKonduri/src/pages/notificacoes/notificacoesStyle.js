import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px 20px 10px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const Title = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #3D2C22;
`;

export const List = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

const CORES_POR_TIPO = {
  novo_pedido: { bg: '#E6F4EA', border: '#A9D8B8', bgLida: '#F5FAF6', borderLida: '#D4EDDA' },
  pedido_cancelado: { bg: '#FDEDEC', border: '#F1A9A0', bgLida: '#FDF5F4', borderLida: '#F5D5D1' },
  pedido_editado: { bg: '#E8F4FD', border: '#A9CDF1', bgLida: '#F5FAFE', borderLida: '#D4E7FA' }, // ← adiciona essa linha
};

export const NotifItem = styled.TouchableOpacity`
  background-color: ${(props) => {
    const cor = CORES_POR_TIPO[props.tipo];
    if (!cor) return props.lida ? '#FFFFFF' : '#FDF3E7';
    return props.lida ? cor.bgLida : cor.bg;
  }};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${(props) => {
    const cor = CORES_POR_TIPO[props.tipo];
    if (!cor) return props.lida ? '#E6DFD5' : '#F0D9A0';
    return props.lida ? cor.borderLida : cor.border;
  }};
`;

export const NotifTitulo = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 3px;
`;

export const NotifMensagem = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const NotifHora = styled.Text`
  font-size: 11px;
  color: #A99B8F;
  margin-top: 6px;
`;

export const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  font-size: 14px;
  color: #8C7355;
  text-align: center;
  margin-top: 10px;
`;

export const NotifImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: #F0EAE1;
  margin-right: 12px;
`;

export const NotifImagePlaceholder = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: #FDEBD3;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

export const NotifRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const NotifTextGroup = styled.View`
  flex: 1;
`;

export const NotifValorBadge = styled.View`
  background-color: #FDF3E7;
  border-radius: 8px;
  padding-horizontal: 8px;
  padding-vertical: 3px;
  align-self: flex-start;
  margin-top: 6px;
`;

export const NotifValorText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #B85D00;
`;

export const NotifChevron = styled.View`
  margin-left: 8px;
`;

export const StackedImagesContainer = styled.View`
  width: 60px;
  height: 48px;
  margin-right: 12px;
  justify-content: center;
`;

export const StackedImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F0EAE1;
  border-width: 2px;
  border-color: #FFFFFF;
  position: absolute;
`;