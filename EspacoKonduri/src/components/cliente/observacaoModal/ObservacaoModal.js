import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Overlay,
  Content,
  Header,
  Title,
  Input,
  SaveButton,
  SaveButtonText,
} from './observacaoModalStyle';

export default function ObservacaoModal({ visible, onClose, value, onChangeText }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay>
        <Content>
          <Header>
            <Title>Alguma mensagem?</Title>
            <Ionicons name="close" size={22} color="#1A1A1A" onPress={onClose} />
          </Header>

          <Input
            placeholder="Ex: sem gelo, embalar pra viagem..."
            placeholderTextColor="#9E9E9E"
            value={value}
            onChangeText={onChangeText}
            multiline
            autoFocus
          />

          <SaveButton onPress={onClose}>
            <SaveButtonText>Salvar</SaveButtonText>
          </SaveButton>
        </Content>
      </Overlay>
    </Modal>
  );
}