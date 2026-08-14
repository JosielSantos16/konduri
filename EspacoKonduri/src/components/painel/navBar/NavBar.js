import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomNavBar,
  NavItem,
  NavText,
} from "./navBarStyle";

export default function NavBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <BottomNavBar style={{ paddingBottom: 10 + insets.bottom }}>
        <NavItem active={true} onPress={() => router.push("/painel")}>
          <Ionicons name="grid-outline" size={22} color="#E67E22" />
          <NavText active={true}>Painel</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/vendas")}>
          <Ionicons name="receipt-outline" size={22} color="#8C7355" />
          <NavText active={false}>Vendas</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/estoque")}>
          <Ionicons name="cube-outline" size={22} color="#8C7355" />
          <NavText active={false}>Estoque</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/abertura")}>
          <Ionicons name="receipt-outline" size={22} color="#8C7355" />
          <NavText active={false}>Controle</NavText>
        </NavItem>
      </BottomNavBar>
    </>
  );
}
