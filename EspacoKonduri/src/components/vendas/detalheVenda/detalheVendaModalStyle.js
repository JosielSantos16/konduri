import styled from 'styled-components/native';

export const DetalheOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const DetalheContent = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 80%;
`;

export const DetalheHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const DetalheTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const DetalheCloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const DetalheInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const DetalheInfoLabel = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
`;

export const DetalheInfoValue = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const DetalheDivider = styled.View`
  height: 1px;
  background-color: #E6E6E0;
  margin-vertical: 14px;
`;

export const DetalheItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #F1F1EB;
`;

export const DetalheItemImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F1F1EB;
  margin-right: 12px;
`;

export const DetalheItemImagePlaceholder = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F1F1EB;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

export const DetalheItemInfo = styled.View`
  flex: 1;
`;

export const DetalheItemNome = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const DetalheItemQty = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const DetalheItemSubtotal = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #6B5300;
`;

export const DetalheTotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
`;

export const DetalheTotalLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const DetalheTotalValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => (props.cancelada ? '#9E9E9E' : '#6B5300')};
  text-decoration-line: ${(props) => (props.cancelada ? 'line-through' : 'none')};
`;

/* Cancelamento */

export const CanceladaBadge = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  background-color: #FDEDEC;
  border-radius: 10px;
  padding: 4px 10px;
  margin-bottom: 12px;
`;

export const CanceladaBadgeText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 4px;
  letter-spacing: 0.5px;
`;

export const CancelarButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1.5px;
  border-color: #C0392B;
  border-radius: 12px;
  height: 48px;
  margin-top: 16px;
`;

export const CancelarButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 6px;
`;

export const CancelamentoTitulo = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const MotivoInput = styled.TextInput`
  background-color: #FAFAF7;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 12px 14px;
  font-size: 14px;
  color: #1A1A1A;
  min-height: 70px;
  text-align-vertical: top;
`;

export const MotivoContador = styled.Text`
  font-size: 11px;
  color: #9E9E9E;
  text-align: right;
  margin-top: 4px;
`;

export const AvisoBox = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.bg || '#FFF7D1'};
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
`;

export const AvisoTexto = styled.Text`
  flex: 1;
  font-size: 13px;
  line-height: 18px;
  color: ${(props) => props.cor || '#6B5300'};
  margin-left: 8px;
`;

export const AcoesRow = styled.View`
  flex-direction: row;
  margin-top: 14px;
`;

export const BotaoSecundario = styled.TouchableOpacity`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  background-color: #F1F1EB;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

export const BotaoSecundarioTexto = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333333;
`;

export const BotaoPerigo = styled.TouchableOpacity`
  flex: 1.4;
  height: 48px;
  border-radius: 12px;
  background-color: #C0392B;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const BotaoPerigoTexto = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
`;
