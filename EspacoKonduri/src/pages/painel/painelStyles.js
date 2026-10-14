import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FAFAF7;
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
  font-size: 23px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const GreetingSubtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const UserAvatar = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 21px;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #E6E6E0;
`;

export const MainRevenueCard = styled.View`
  background-color: #FFD000;
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
  color: #1A1A1A;
  letter-spacing: 0.8px;
  margin-left: 8px;
`;

export const RevenueValue = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #1A1A1A;
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
  border-color: #E6E6E0;
  elevation: 1;
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.color || '#6B6B6B')};
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${props => (props.valueColor || '#1A1A1A')};
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
  color: #1A1A1A;
`;

export const SectionLink = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8A6A00;
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
  border-color: #E6E6E0;
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
  background-color: #FFD000;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

export const RankBadgeText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const RankInfo = styled.View`
  flex-direction: column;
`;

export const RankItemTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-bottom: 2px;
`;

export const RankItemSubtitle = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
`;

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
  color: ${props => (props.active ? '#8A6A00' : '#6B6B6B')};
  margin-top: 4px;
`;

export const LowStockBanner = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFF7D1;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #F2DC7C;
`;

export const LowStockIconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F2DC7C;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const LowStockTextGroup = styled.View`
  flex: 1;
`;

export const LowStockTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #6B5300;
`;

export const LowStockSubtitle = styled.Text`
  font-size: 12px;
  color: #6B5300;
  margin-top: 2px;
`;

export const UserAvatarImage = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 21px;
`;

export const RankImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  margin-right: 12px;
`;

export const RankImagePlaceholder = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F1F1EB;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;