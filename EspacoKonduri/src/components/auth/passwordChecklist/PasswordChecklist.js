import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ChecklistContainer, ChecklistRow, ChecklistText } from "./passwordChecklistStyle";

const REQUISITOS_SENHA = [
  { key: "minLength", label: "Mínimo de 8 caracteres" },
  { key: "hasUpper", label: "Pelo menos 1 letra maiúscula" },
  { key: "hasLower", label: "Pelo menos 1 letra minúscula" },
  { key: "hasNumber", label: "Pelo menos 1 número" },
  { key: "semSequenciaOuRepeticao", label: "Sem sequência ou repetição óbvia" },
];

export default function PasswordChecklist({ checks }) {
  return (
    <ChecklistContainer>
      {REQUISITOS_SENHA.map((req) => (
        <ChecklistRow key={req.key}>
          <Ionicons
            name={checks[req.key] ? "checkmark-circle" : "ellipse-outline"}
            size={14}
            color={checks[req.key] ? "#2E5A1E" : "#A99B8F"}
          />
          <ChecklistText ok={checks[req.key]}>{req.label}</ChecklistText>
        </ChecklistRow>
      ))}
    </ChecklistContainer>
  );
}