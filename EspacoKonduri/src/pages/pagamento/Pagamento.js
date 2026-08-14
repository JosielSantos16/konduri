import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCaixa } from '../../contexts/CaixaContext';
import { useEstoque } from '../../contexts/EstoqueContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeContainer from '../../styles/SafeContainer';
import { Container, FinalizeButton, FinalizeButtonText } from './pagamentoStyles';
import { useTroco } from '../../hooks/useTroco';
import { useVendas } from '../../contexts/VendasContext';
import PagamentoHeader from '../../components/pagamento/header/Header';
import VendaTotalCard from '../../components/pagamento/totalCard/TotalCard';
import PaymentMethodSelector from '../../components/pagamento/formaPagamento/FormaPagamento';
import TrocoCalculator from '../../components/pagamento/trocoCalculo/TrocoCalculo';

export default function Pagamento() {
  const router = useRouter();
  const { total, itens } = useLocalSearchParams();
  const totalVenda = Number(total) || 0;
  const itensVenda = itens ? JSON.parse(itens) : [];

  const { registrarVenda } = useVendas();
  const { decreaseByTitle } = useEstoque();
  const { responsavel } = useCaixa();
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const { valorRecebido, setValorRecebido, troco, insuficiente } = useTroco(totalVenda);

  const podeFinalizar = selectedMethod === 'pix' || !insuficiente;

 const handleFinalizar = () => {
  const venda = registrarVenda({
    total: totalVenda,
    metodo: selectedMethod,
    itens: itensVenda,
  });

  itensVenda.forEach(item => decreaseByTitle(item.title, item.qty));

  router.push({
    pathname: '/status',
    params: {
      total: totalVenda.toFixed(2),
      metodo: selectedMethod,
      comprovante: venda.id,
      data: venda.data,
    },
  });
};

  return (
    <SafeContainer>
      <Container>
        <PagamentoHeader onBack={() => router.back()} />

        <VendaTotalCard total={totalVenda} atendente={responsavel || 'Operador'} caixaId="04" />
        
        <PaymentMethodSelector selected={selectedMethod} onSelect={setSelectedMethod} />

        {selectedMethod === 'dinheiro' && (
          <TrocoCalculator
            valorRecebido={valorRecebido}
            onChangeValorRecebido={setValorRecebido}
            troco={troco}
            insuficiente={insuficiente}
          />
        )}

        <FinalizeButton
          disabled={!podeFinalizar}
          style={{ opacity: podeFinalizar ? 1 : 0.5 }}
          onPress={handleFinalizar}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <FinalizeButtonText>Finalizar e Emitir Comprovante</FinalizeButtonText>
        </FinalizeButton>
      </Container>
    </SafeContainer>
  );
}