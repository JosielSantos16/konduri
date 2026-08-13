import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
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

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding-horizontal: 14px;
  height: 50px;
  margin-bottom: 10px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #3D2C22;
  margin-left: 10px;
`;

export const StockList = styled.FlatList`
  padding-horizontal: 20px;
`;

export const StockCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const StockInfo = styled.View`
  flex-direction: column;
  flex: 1;
`;

export const StockItemTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 6px;
`;

export const StockDetailsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StockQuantityText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
  margin-right: 8px;
`;

export const StatusBadge = styled.View`
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: 8px;
  background-color: ${props => {
    if (props.status === 'ok') return '#E8F8F5';
    if (props.status === 'baixo') return '#FEF9E7';
    return '#FDEDEC';
  }};
`;

export const StatusText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => {
    if (props.status === 'ok') return '#16A085';
    if (props.status === 'baixo') return '#F39C12';
    return '#E74C3C';
  }};
`;

export const StockActions = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ActionButtonMinus = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

export const ActionButtonPlus = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #3D2C22;
  justify-content: center;
  align-items: center;
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