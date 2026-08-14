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

export const DateFilterButton = styled.View`
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
`;

export const SaleIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => (props.type === 'pix' ? '#E8F8F5' : '#E9F7EF')};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const SaleInfo = styled.View`
  flex-direction: column;
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

export const SaleRight = styled.View`
  flex-direction: row;
  align-items: center;
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