import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabContainer, TabButton, TabText, TabCount } from './tabSelectorStyle';

const TABS = [
  { key: 'produtos', label: 'Produtos', icon: 'basket-outline' },
  { key: 'ingressos', label: 'Entradas/Ingressos', icon: 'ticket-outline' },
];

export default function TabSelector({ activeTab, onChange, contagemPorCategoria = {} }) {
  return (
    <TabContainer>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const quantidade = contagemPorCategoria[tab.key] || 0;

        return (
          <TabButton key={tab.key} active={isActive} onPress={() => onChange(tab.key)}>
            <Ionicons name={tab.icon} size={18} color={isActive ? '#1A1A1A' : '#6B6B6B'} />
            <TabText active={isActive}>{tab.label}</TabText>
            <TabCount active={isActive}>({quantidade})</TabCount>
          </TabButton>
        );
      })}
    </TabContainer>
  );
}