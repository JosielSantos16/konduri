import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, NavItem, NavText } from './navBarClienteStyle';

const TABS = [
  { key: 'inicio', label: 'Início', icon: 'home-outline', route: '/cliente-home' },
  { key: 'pedidos', label: 'Pedidos', icon: 'receipt-outline', route: '/meu-pedido' },
  { key: 'mais', label: 'Mais', icon: 'ellipsis-horizontal-outline', route: '/cliente-mais' },
  { key: 'perfil', label: 'Perfil', icon: 'person-outline', route: '/cliente-perfil' },
];

export default function NavBarCliente() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <BottomNavBar style={{ paddingBottom: 10 + insets.bottom }}>
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.route);

        return (
          <NavItem key={tab.key} onPress={() => router.push(tab.route)}>
            <Ionicons name={tab.icon} size={22} color={isActive ? '#E67E22' : '#8C7355'} />
            <NavText active={isActive}>{tab.label}</NavText>
          </NavItem>
        );
      })}
    </BottomNavBar>
  );
}