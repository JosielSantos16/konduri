import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  padding: 20px 20px 10px 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-bottom: 15px;
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
  border-color: #E6DFD5;
  border-radius: 12px;
  padding: 8px 12px;
`;

export const DateFilterText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-left: 6px;
  margin-right: 6px;
`;

export const TotalRecordsText = styled.Text`
  font-size: 13px;
  color: #8C7355;
  font-weight: bold;
`;

export const SalesList = styled.FlatList`
  padding-horizontal: 20px;
`;

export const SaleCard = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const SaleLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SaleRight = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`;

export const SaleIconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  overflow: hidden;
`;

export const SaleProductImage = styled.Image`
  width: 44px;
  height: 44px;
`;

export const MetodoBadge = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) => (props.type === 'pix' ? '#E8F8F5' : '#E9F7EF')};
  justify-content: center;
  align-items: center;
  margin-right: 6px;
`;

export const SaleTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 2px;
`;

export const SaleDetails = styled.Text`
  font-size: 12px;
  color: #8C7355;
`;

export const SalePrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
  margin-right: 8px;
`;

export const SummaryBar = styled.View`
  background-color: #3D2C22;
  padding: 16px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

export const SummaryLabel = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #A99B8F;
  letter-spacing: 0.5px;
`;

export const SummaryValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #E67E22;
`;

export const BottomNavBar = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #E6DFD5;
  padding-vertical: 10px;
  padding-horizontal: 10px;
  justify-content: space-around;
  align-items: center;
  elevation: 10;
`;

export const NavItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const NavText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.active ? '#E67E22' : '#8C7355')};
  margin-top: 4px;
`;

export const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #8C7355;
  text-align: center;
  margin-top: 12px;
`;

/* --- Seção de comissão --- */

export const ComissaoSection = styled.View`
  padding-horizontal: 20px;
  margin-top: 4px;
  margin-bottom: 14px;
`;

export const ComissaoSectionTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
`;

export const ComissaoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const ComissaoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ComissaoNome = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ComissaoBase = styled.Text`
  font-size: 12px;
  color: #8C7355;
`;

export const ComissaoInputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ComissaoInputContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #F0EAE1;
  border-radius: 10px;
  padding-horizontal: 12px;
  height: 44px;
  margin-right: 8px;
`;

export const ComissaoInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ComissaoPercentSymbol = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #8C7355;
`;

export const ComissaoSaveButton = styled.TouchableOpacity`
  background-color: #2E5A1E;
  border-radius: 10px;
  height: 44px;
  padding-horizontal: 16px;
  justify-content: center;
  align-items: center;
`;

export const ComissaoSaveButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const ComissaoSavedBox = styled.View`
  background-color: #E6F4EA;
  border-radius: 10px;
  padding: 10px 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export const ComissaoSavedText = styled.Text`
  font-size: 12px;
  color: #2E5A1E;
`;

export const ComissaoSavedValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const ItemsExpandido = styled.View`
  background-color: #FAF8F5;
  border-radius: 12px;
  padding: 10px 12px;
  margin-top: -4px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const ItemsList = styled.View`
  background-color: #FAF8F5;
  border-radius: 12px;
  padding: 10px 12px;
  margin-top: -4px;
  margin-bottom: 10px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 6px;
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

export const ItemNome = styled.Text`
  font-size: 13px;
  color: #3D2C22;
  flex: 1;
`;

export const ItemQtyPrice = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
`;

export const ItemsEmptyText = styled.Text`
  font-size: 12px;
  color: #A99B8F;
  text-align: center;
  padding-vertical: 8px;
`;

export const SaleInfo = styled.View`
  flex-direction: column;
  flex: 1;
`;

/* --- Modal de detalhes da venda --- */

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
  color: #3D2C22;
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
  color: #8C7355;
`;

export const DetalheInfoValue = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DetalheDivider = styled.View`
  height: 1px;
  background-color: #E6DFD5;
  margin-vertical: 14px;
`;

export const DetalheItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const DetalheItemImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F0EAE1;
  margin-right: 12px;
`;

export const DetalheItemImagePlaceholder = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F0EAE1;
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
  color: #3D2C22;
`;

export const DetalheItemQty = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const DetalheItemSubtotal = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #D35400;
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
  color: #3D2C22;
`;

export const DetalheTotalValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #D35400;
`;