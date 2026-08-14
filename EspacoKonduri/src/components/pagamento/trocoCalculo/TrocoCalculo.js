import React from 'react';
import { formatPrice } from '../../../utils/formatPrice';
import {
  ChangeContainer,
  ChangeHeader,
  ChangeTitle,
  ChangeBadge,
  ChangeBadgeText,
  ChangeInputsRow,
  InputWrapper,
  InputLabel,
  StyledInput,
  ChangeOutputWrapper,
  ChangeBox,
  ChangeValueText,
} from './trocoCalculoStyle';

export default function TrocoCalculator({ valorRecebido, onChangeValorRecebido, troco, insuficiente }) {
  return (
    <ChangeContainer>
      <ChangeHeader>
        <ChangeTitle>Simular Recebimento (Troco)</ChangeTitle>
        <ChangeBadge warning={insuficiente}>
          <ChangeBadgeText warning={insuficiente}>
            {insuficiente ? 'Valor Insuficiente' : 'Dinheiro Selecionado'}
          </ChangeBadgeText>
        </ChangeBadge>
      </ChangeHeader>

      <ChangeInputsRow>
        <InputWrapper>
          <InputLabel>Valor Recebido</InputLabel>
          <StyledInput
            value={valorRecebido}
            onChangeText={onChangeValorRecebido}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor="#B8AA9C"
          />
        </InputWrapper>

        <ChangeOutputWrapper>
          <InputLabel>Troco a Devolver</InputLabel>
          <ChangeBox warning={insuficiente}>
            <ChangeValueText warning={insuficiente}>
              {formatPrice(troco)}
            </ChangeValueText>
          </ChangeBox>
        </ChangeOutputWrapper>
      </ChangeInputsRow>
    </ChangeContainer>
  );
}