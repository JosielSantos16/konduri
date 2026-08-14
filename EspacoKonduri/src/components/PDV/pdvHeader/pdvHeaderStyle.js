import styled from 'styled-components/native';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const UserInfo = styled.View`
  flex-direction: column;
`;

export const UserName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const UserRole = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const HeaderRight = styled.View`
  align-items: flex-end;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #E6F4EA;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 12px;
  margin-bottom: 6px;
`;

export const StatusDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #34A853;
  margin-right: 6px;
`;

export const StatusText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #137333;
`;

export const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;