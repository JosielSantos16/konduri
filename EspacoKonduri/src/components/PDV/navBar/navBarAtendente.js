import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, NavItem, NavText } from './navBarStyle';

const TABS = [
  { key: 'pdv', label: 'Vender', icon: 'basket-outline', route: '/pdv' },
  { key: 'pedido', label: 'Pedidos', icon: 'receipt-outline', route: '/pedido' },
  { key: 'total-dia', label: 'Total do Dia', icon: 'stats-chart-outline', route: '/resumo-dia' },
  { key: 'perfil', label: 'Perfil', icon: 'person-outline', route: '/perfil' },
];

export default function NavBarAtendente() {
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