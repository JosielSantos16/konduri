import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCaixa } from '../../contexts/CaixaContext';
import { useEstoque } from '../../contexts/EstoqueContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeContainer from '../../styles/SafeContainer';
import { Container, FinalizeButton, FinalizeButtonText } from './pagamentoStyles';
import { useTroco } from '../../hooks/useTroco';
import { useVendas } from '../../contexts/VendasContext';
import { registrarVendaNaOperacao } from '../../services/queries/operacoesQueries';
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
  const { responsavel, operacaoId } = useCaixa();
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const { valorRecebido, setValorRecebido, troco, insuficiente } = useTroco(totalVenda);
  const [finalizando, setFinalizando] = useState(false);

  const podeFinalizar = (selectedMethod === 'pix' || !insuficiente) && !finalizando;

  const handleFinalizar = async () => {
  if (!podeFinalizar) return;
  setFinalizando(true);

  console.log('🔍 operacaoId no momento da venda:', operacaoId);
  console.log('🔍 itens sendo vendidos:', JSON.stringify(itensVenda, null, 2));

  try {
    const venda = await registrarVenda({
      total: totalVenda,
      metodo: selectedMethod,
      itens: itensVenda,
    });

    console.log('✅ Venda registrada no Firestore, id:', venda.id);

    await Promise.all(
      itensVenda.map((item) => decreaseByTitle(item.title, item.qty, item.id))
    );

    console.log('✅ Estoque do catálogo abatido');

    if (operacaoId) {
      console.log('🔍 Chamando registrarVendaNaOperacao...');
      await registrarVendaNaOperacao(operacaoId, itensVenda);
      console.log('✅ registrarVendaNaOperacao concluído sem erro');
    } else {
      console.log('❌ operacaoId está NULO — não vai atualizar o Controle do Dia');
    }

    // resto do código continua igual...

      router.push({
        pathname: '/status',
        params: {
          total: totalVenda.toFixed(2),
          metodo: selectedMethod,
          comprovante: venda.id,
          data: venda.criadoEm,
        },
      });
    } catch (erro) {
      console.error('Erro ao finalizar venda:', erro);
      router.push({
        pathname: '/status',
        params: {
          total: totalVenda.toFixed(2),
          metodo: selectedMethod,
        },
      });
    } finally {
      setFinalizando(false);
    }
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
          <FinalizeButtonText>
            {finalizando ? 'Registrando...' : 'Finalizar e Emitir Comprovante'}
          </FinalizeButtonText>
        </FinalizeButton>
      </Container>
    </SafeContainer>
  );
}