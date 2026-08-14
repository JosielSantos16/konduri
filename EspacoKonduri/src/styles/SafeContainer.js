import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const StyledView = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export default function SafeContainer({ children, style }) {
  const insets = useSafeAreaInsets();

  return (
    <StyledView
      style={[
        {
          // Único lugar responsável pela safe area inteira (topo, base e laterais).
          // Não duplique isso em outros componentes (ex: CartBar, Header).
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 20),
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      {children}
    </StyledView>
  );
}