import styled from 'styled-components/native';

export const BottomNavBar = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #E6E6E0;
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
  color: ${(props) => (props.active ? '#8A6A00' : '#6B6B6B')};
  margin-top: 4px;
`;