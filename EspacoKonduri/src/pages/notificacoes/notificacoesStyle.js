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
  novo_pedido: { accent: '#27AE60', bgLida: '#FFFFFF' },
  pedido_cancelado: { accent: '#C0392B', bgLida: '#FFFFFF' },
  pedido_editado: { accent: '#1A73C0', bgLida: '#FFFFFF' },
};

export const NotifItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: stretch;
  background-color: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  overflow: hidden;
  opacity: ${(props) => (props.lida ? 0.55 : 1)};
`;

export const NotifAccentBar = styled.View`
  width: 4px;
  background-color: ${(props) => {
    const cor = CORES_POR_TIPO[props.tipo];
    return cor ? cor.accent : '#D6CFC4';
  }};
  opacity: ${(props) => (props.lida ? 0.35 : 1)};
`;

export const NotifContent = styled.View`
  flex: 1;
  padding: 14px 16px;
`;

export const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #E67E22;
  margin-left: 8px;
`;

export const NotifTitulo = styled.Text`
  font-size: 14px;
  font-weight: ${(props) => (props.lida ? '600' : 'bold')};
  color: ${(props) => (props.lida ? '#7A6555' : '#3D2C22')};
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

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px 20px;
`;

export const HeaderLeftGroup = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ClearAllButton = styled.TouchableOpacity`
  padding: 6px 10px;
`;

export const ClearAllButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #C0392B;
`;