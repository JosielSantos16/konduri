import { useState, useRef } from "react";
import { Animated, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../../../utils/formatPrice";
import {
  SheetContainer,
  SheetHandle,
  SheetCollapsedRow,
  SheetExpandedContent,
  SheetDivider,
  SheetRow,
  SheetRowLabel,
  SheetRowValue,
  SheetSectionTitle,
} from "./bottomSheetResumoStyle";

const NAVBAR_HEIGHT = 60;
const COLLAPSED_HEIGHT = 76;
const EXPANDED_HEIGHT = 260;

export default function BottomSheetResumo({
  totalPeriodo,
  qtdVendas,
  totalPix,
  totalDinheiro,
  listaResumoGeral,
}) {
  const insets = useSafeAreaInsets();
  const bottomOffset = NAVBAR_HEIGHT + insets.bottom;

  const [expandido, setExpandido] = useState(false);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  const animarPara = (expandir) => {
    Animated.spring(heightAnim, {
      toValue: expandir ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
    setExpandido(expandir);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderMove: (_, gesture) => {
        const base = expandido ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
        const novaAltura = base - gesture.dy;
        const limitada = Math.max(
          COLLAPSED_HEIGHT,
          Math.min(EXPANDED_HEIGHT, novaAltura),
        );
        heightAnim.setValue(limitada);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -30) animarPara(true);
        else if (gesture.dy > 30) animarPara(false);
        else animarPara(expandido);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{
        height: heightAnim,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
      }}
    >
      <SheetContainer style={{ flex: 1 }} {...panResponder.panHandlers}>
        <SheetHandle />

        <SheetCollapsedRow onTouchEnd={() => animarPara(!expandido)}>
          <SheetRowLabel
            style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 0.5 }}
          >
            SOMA TOTAL PERÍODO
          </SheetRowLabel>
          <SheetRowValue style={{ color: "#E67E22", fontSize: 16 }}>
            {qtdVendas} Vendas — {formatPrice(totalPeriodo)}
          </SheetRowValue>
        </SheetCollapsedRow>

        {expandido && (
          <SheetExpandedContent>
            <SheetDivider />

            <SheetSectionTitle>POR FORMA DE PAGAMENTO</SheetSectionTitle>
            <SheetRow>
              <SheetRowLabel>Pix</SheetRowLabel>
              <SheetRowValue>{formatPrice(totalPix)}</SheetRowValue>
            </SheetRow>
            <SheetRow>
              <SheetRowLabel>Dinheiro</SheetRowLabel>
              <SheetRowValue>{formatPrice(totalDinheiro)}</SheetRowValue>
            </SheetRow>

            {listaResumoGeral.length > 0 && (
              <>
                <SheetDivider />
                <SheetSectionTitle>POR ATENDENTE</SheetSectionTitle>
                {listaResumoGeral.map((r) => (
                  <SheetRow key={r.responsavelUid}>
                    <SheetRowLabel>{r.responsavelNome}</SheetRowLabel>
                    <SheetRowValue>{formatPrice(r.totalGeral)}</SheetRowValue>
                  </SheetRow>
                ))}
              </>
            )}
          </SheetExpandedContent>
        )}
      </SheetContainer>
    </Animated.View>
  );
}
