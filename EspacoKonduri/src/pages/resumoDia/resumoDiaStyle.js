import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitles = styled.View``;

export const HeaderTitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  margin-top: 2px;
`;

export const TotalCard = styled.View`
  background-color: #E67E22;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 3;
`;

export const TotalCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const TotalLabel = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.8px;
  margin-left: 8px;
`;

export const TotalValue = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

export const StatCard = styled.View`
  flex: 1;
  background-color: ${(props) => props.bg || '#FFFFFF'};
  border-radius: 14px;
  padding: 14px;
  margin-horizontal: 4px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => props.color || '#8C7355'};
  margin-bottom: 4px;
  letter-spacing: 0.3px;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.valueColor || '#3D2C22'};
`;

export const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 10px;
  margin-top: 4px;
`;

export const EmptyState = styled.View`
  align-items: center;
  padding: 30px 20px;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const EmptyStateText = styled.Text`
  font-size: 13px;
  color: #8C7355;
  text-align: center;
  margin-top: 8px;
`;

export const CommissionCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 18px;
  padding: 20px;
  margin-top: 24px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const CommissionTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 4px;
`;

export const CommissionSubtitle = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-bottom: 16px;
`;



export const CommissionResultBox = styled.View`
  background-color: #FDF3E7;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

export const CommissionResultLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #B85D00;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const CommissionResultValue = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #D35400;
`;

export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1.5px;
  border-color: #C0392B;
  border-radius: 12px;
  height: 52px;
  margin-bottom: 30px;
`;

export const LogoutButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #C0392B;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;

export const DateSelectorButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6DFD5;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 16px;
  align-self: flex-start;
`;

export const DateSelectorText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-horizontal: 6px;
`;

export const StatusBox = styled.View`
  background-color: ${(props) => (props.definida ? '#E6F4EA' : '#F0EAE1')};
  border-radius: 10px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

export const StatusText = styled.Text`
  flex: 1;
  font-size: 12px;
  color: ${(props) => (props.definida ? '#2E5A1E' : '#8C7355')};
  margin-left: 8px;
  line-height: 16px;
`;