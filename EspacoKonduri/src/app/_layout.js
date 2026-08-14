import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";
import theme from "../styles/theme";
import { VendasProvider } from "../contexts/VendasContext";
import { EstoqueProvider } from '../contexts/EstoqueContext';
import { CaixaProvider } from "../contexts/CaixaContext";

export default function RootLayout() {
  return (
    <CaixaProvider>
      <VendasProvider>
      <EstoqueProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ThemeProvider theme={theme}>
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </EstoqueProvider>
    </VendasProvider>
    </CaixaProvider>
  );
}
