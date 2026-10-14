import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
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
  color: #1A1A1A;
`;

export const Subtitle = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
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