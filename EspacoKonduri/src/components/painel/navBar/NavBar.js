import React from "react";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomNavBar,
  NavItem,
  NavText,
} from "./navBarStyle";

const TABS = [
  { key: "painel", label: "Painel", icon: "grid-outline", route: "/painel" },
  { key: "vendas", label: "Vendas", icon: "receipt-outline", route: "/vendas" },
  { key: "estoque", label: "Estoque", icon: "cube-outline", route: "/estoque" },
  { key: "controle", label: "Controle", icon: "clipboard-outline", route: "/abertura" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <BottomNavBar style={{ paddingBottom: 10 + insets.bottom }}>
      {TABS.map((tab) => {
        // "Controle" cobre tanto /abertura quanto /controle, já que o fluxo
        // passa por essas duas rotas mas pertence à mesma aba visualmente
        const isActive =
          tab.key === "controle"
            ? pathname.startsWith("/abertura") || pathname.startsWith("/controle")
            : pathname.startsWith(tab.route);

        return (
          <NavItem key={tab.key} active={isActive} onPress={() => router.push(tab.route)}>
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? "#E67E22" : "#8C7355"}
            />
            <NavText active={isActive}>{tab.label}</NavText>
          </NavItem>
        );
      })}
    </BottomNavBar>
  );
}