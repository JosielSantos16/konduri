import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px 20px 10px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const Title = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Subtitle = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const ProductGrid = styled.FlatList`
  flex: 1;
  padding-horizontal: 15px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const HeaderTexts = styled.View``;