import React from "react";
import { Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ComissaoAtendenteCard from "./ComissaoAtendenteCard";
import {
  ComissaoModalOverlay,
  ComissaoModalContent,
  ComissaoModalHeader,
  ComissaoModalTitle,
  ComissaoModalCloseButton,
  ComissaoModalSubtitle,
  ComissaoModalEmptyText,
} from "../../../pages/vendas/vendasStyles";

export default function ComissaoModal({
  visible,
  onClose,
  listaAtendentes,
  dataISO,
  adminUid,
  onSalvo,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ComissaoModalOverlay>
          <ComissaoModalContent>
            <ComissaoModalHeader>
              <ComissaoModalTitle>Comissão do Dia</ComissaoModalTitle>
              <ComissaoModalCloseButton onPress={onClose}>
                <Ionicons name="close" size={24} color="#3D2C22" />
              </ComissaoModalCloseButton>
            </ComissaoModalHeader>

            <ComissaoModalSubtitle>
              Cálculo baseado somente nas vendas de produtos (ingressos não entram)
            </ComissaoModalSubtitle>

            {listaAtendentes.length === 0 ? (
              <ComissaoModalEmptyText>
                Nenhuma venda de produto registrada nesse dia ainda.
              </ComissaoModalEmptyText>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {listaAtendentes.map((atendente) => (
                  <ComissaoAtendenteCard
                    key={atendente.responsavelUid}
                    dataISO={dataISO}
                    responsavelUid={atendente.responsavelUid}
                    responsavelNome={atendente.responsavelNome}
                    baseCalculo={atendente.baseCalculo}
                    adminUid={adminUid}
                    onSalvo={onSalvo}
                  />
                ))}
              </ScrollView>
            )}
          </ComissaoModalContent>
        </ComissaoModalOverlay>
      </KeyboardAvoidingView>
    </Modal>
  );
}