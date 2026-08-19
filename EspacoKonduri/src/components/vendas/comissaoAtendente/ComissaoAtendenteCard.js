import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { formatPrice } from "../../../utils/formatPrice";
import {
  salvarComissao,
  subscribeToComissao,
} from "../../../services/queries/comissaoQueries";
import {
  ComissaoCard,
  ComissaoHeader,
  ComissaoNome,
  ComissaoBase,
  ComissaoInputRow,
  ComissaoInputContainer,
  ComissaoInput,
  ComissaoPercentSymbol,
  ComissaoSaveButton,
  ComissaoSaveButtonText,
  ComissaoSavedBox,
  ComissaoSavedText,
  ComissaoSavedValue,
} from "./comissaoAtendenteCardStyle";
export default function ComissaoAtendenteCard({
  dataISO,
  responsavelUid,
  responsavelNome,
  baseCalculo,
  adminUid,
  onSalvo,
}) {
  const [comissaoSalva, setComissaoSalva] = useState(null);
  const [percentualInput, setPercentualInput] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComissao(dataISO, responsavelUid, (comissao) => {
      setComissaoSalva(comissao);
      if (comissao) setPercentualInput(String(comissao.percentual));
    });
    return unsubscribe;
  }, [dataISO, responsavelUid]);

  const handleChangePercentual = (texto) => {
    setPercentualInput(texto.replace(/[^0-9,.]/g, ""));
  };

  const executarSalvar = async () => {
    const percentualNumero = Number(percentualInput.replace(",", "."));

    setSalvando(true);
    try {
      await salvarComissao({
        dataISO,
        responsavelUid,
        responsavelNome,
        percentual: percentualNumero,
        baseCalculo,
        definidoPorUid: adminUid,
      });

      if (onSalvo) onSalvo();
    } catch (erro) {
      console.error("Erro ao salvar comissão:", erro);
      Alert.alert("Erro", "Não foi possível salvar a comissão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvar = () => {
    const percentualNumero = Number(percentualInput.replace(",", "."));

    if (!percentualInput || isNaN(percentualNumero) || percentualNumero < 0) {
      Alert.alert("Percentual inválido", "Informe um percentual válido.");
      return;
    }

    if (comissaoSalva && comissaoSalva.percentual !== percentualNumero) {
      Alert.alert(
        "Alterar comissão",
        `Essa comissão já estava definida como ${comissaoSalva.percentual}%. Deseja alterar para ${percentualNumero}%?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Alterar", onPress: executarSalvar },
        ]
      );
      return;
    }

    executarSalvar();
  };

  return (
    <ComissaoCard>
      <ComissaoHeader>
        <ComissaoNome>{responsavelNome}</ComissaoNome>
        <ComissaoBase>Base: {formatPrice(baseCalculo)}</ComissaoBase>
      </ComissaoHeader>

      <ComissaoInputRow>
        <ComissaoInputContainer>
          <ComissaoInput
            value={percentualInput}
            onChangeText={handleChangePercentual}
            placeholder="Percentual"
            placeholderTextColor="#A99B8F"
            keyboardType="decimal-pad"
          />
          <ComissaoPercentSymbol>%</ComissaoPercentSymbol>
        </ComissaoInputContainer>

        <ComissaoSaveButton onPress={handleSalvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ComissaoSaveButtonText>SALVAR</ComissaoSaveButtonText>
          )}
        </ComissaoSaveButton>
      </ComissaoInputRow>

      {comissaoSalva && (
        <ComissaoSavedBox>
          <ComissaoSavedText>Comissão definida ({comissaoSalva.percentual}%)</ComissaoSavedText>
          <ComissaoSavedValue>{formatPrice(comissaoSalva.valorComissao)}</ComissaoSavedValue>
        </ComissaoSavedBox>
      )}
    </ComissaoCard>
  );
}