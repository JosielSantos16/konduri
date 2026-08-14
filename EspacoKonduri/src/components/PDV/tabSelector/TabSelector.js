import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabContainer, TabButton, TabText } from './tabSelectorStyle';

const TABS = [
  { key: 'produtos', label: 'Produtos', icon: 'basket-outline' },
  { key: 'ingressos', label: 'Entradas/Ingressos', icon: 'ticket-outline' },
];

export default function TabSelector({ activeTab, onChange }) {
  return (
    <TabContainer>
      {TABS.map(tab => (
        <TabButton
          key={tab.key}
          active={activeTab === tab.key}
          onPress={() => onChange(tab.key)}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={activeTab === tab.key ? '#FFF' : '#8C7355'}
          />
          <TabText active={activeTab === tab.key}>{tab.label}</TabText>
        </TabButton>
      ))}
    </TabContainer>
  );
}