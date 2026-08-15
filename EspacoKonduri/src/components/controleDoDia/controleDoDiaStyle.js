import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitles = styled.View``;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const HeaderDate = styled.Text`
  font-size: 13px;
  color: #D35400;
  font-weight: bold;
`;

export const UserBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F0EAE1;
  padding-horizontal: 10px;
  padding-vertical: 6px;
  border-radius: 16px;
`;

export const UserBadgeText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-left: 6px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  margin-bottom: 10px;
`;

export const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
  letter-spacing: 0.5px;
`;

export const AddButton = styled.TouchableOpacity``;

export const ProductsList = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const EmptyState = styled.View`
  align-items: center;
  padding: 40px 20px;
`;

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #8C7355;
  text-align: center;
  margin-top: 10px;
`;