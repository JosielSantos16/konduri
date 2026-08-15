import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ScrollContainer = styled.ScrollView`
  padding: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const GreetingContainer = styled.View`
  flex-direction: column;
`;

export const GreetingTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #3D2C22;
`;

export const GreetingSubtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const NotificationButton = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const NotificationBadgeDot = styled.View`
  position: absolute;
  top: 10px;
  right: 11px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #E74C3C;
`;

export const UserAvatar = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const MainRevenueCard = styled.View`
  background-color: #F39C12;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 15px;
  elevation: 3;
`;

export const RevenueCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const RevenueTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.8px;
  margin-left: 8px;
`;

export const RevenueValue = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
`;

export const StatCard = styled.View`
  flex: 1;
  background-color: ${props => (props.bg || '#FFFFFF')};
  border-radius: 16px;
  padding: 16px;
  margin-horizontal: 4px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.color || '#8C7355')};
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${props => (props.valueColor || '#3D2C22')};
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const SectionLink = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #E67E22;
`;

export const RankingCard = styled.View`
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

export const RankingLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RankBadge = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #F39C12;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

export const RankBadgeText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const RankInfo = styled.View`
  flex-direction: column;
`;

export const RankItemTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 2px;
`;

export const RankItemSubtitle = styled.Text`
  font-size: 12px;
  color: #8C7355;
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