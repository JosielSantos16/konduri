import styled from 'styled-components/native';

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const HeaderTitleContainer = styled.View`
  flex-direction: column;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;