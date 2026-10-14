import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registrarVendaFirestore, subscribeToVendasPorData } from '../services/queries/vendasQueries';
import { paraDataISOLocal } from '../utils/dataLocal';
import { useAuth } from '../hooks/useAuth';
import { useCaixa } from './CaixaContext';
import { useProdutos } from './ProdutosContext';
import { totalPorMetodo } from '../utils/metodosPagamento';
import { vendaValida } from '../utils/financeiro';

const VendasContext = createContext(null);

export function VendasProvider({ children }) {
  const { usuario } = useAuth();
  const { operacaoId } = useCaixa();
  const { produtos } = useProdutos();

  const [vendasHoje, setVendasHoje] = useState([]);
  const [carregandoVendas, setCarregandoVendas] = useState(true);
  const [hojeISO, setHojeISO] = useState(paraDataISOLocal());

  // Vira o dia sozinho depois da meia-noite: as vendas novas já são gravadas
  // com a data nova, e o "dia" do Painel precisa acompanhar
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = paraDataISOLocal();
      setHojeISO((anterior) => (anterior === agora ? anterior : agora));
    }, 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  const usuarioUid = usuario?.uid;
  useEffect(() => {
    if (!usuarioUid) {
      setVendasHoje([]);
      setCarregandoVendas(false);
      return undefined;
    }

    setCarregandoVendas(true);
    const unsubscribe = subscribeToVendasPorData(hojeISO, (lista) => {
      setVendasHoje(lista);
      setCarregandoVendas(false);
    });

    return unsubscribe;
  }, [usuarioUid, hojeISO]);

  const registrarVenda = useCallback(
    async ({ total, metodo, itens }) => {
      // Custo médio atual de cada produto, lido aqui (e não no carrinho) para
      // não trafegar pelo PDV, pagamento, impressão e Pix
      const itensComCustoAtual = (itens || []).map((item) => {
        const produto = produtos.find((p) => p.id === item.id);
        return { ...item, custoUnitario: produto?.custoMedio ?? produto?.custoUnitario ?? null };
      });

      const venda = await registrarVendaFirestore({
        operacaoId,
        responsavelUid: usuario?.uid,
        responsavelNome: usuario?.nome,
        total,
        metodo,
        itens: itensComCustoAtual,
      });
      return venda;
    },
    [operacaoId, usuario, produtos]
  );

  // Vendas canceladas continuam em vendasHoje (histórico), mas fora dos totais
  const vendasValidasHoje = vendasHoje.filter(vendaValida);

  const faturamentoDia = vendasValidasHoje.reduce((sum, v) => sum + v.total, 0);

  const totalPix = totalPorMetodo(vendasValidasHoje, 'pix');
  const totalCartao = totalPorMetodo(vendasValidasHoje, 'cartao');
  const totalDinheiro = totalPorMetodo(vendasValidasHoje, 'dinheiro');

  const maisVendidos = (() => {
  const contagem = {};
  vendasValidasHoje.forEach((venda) => {
    (venda.itens || []).forEach((item) => {
      if (item.tipo === 'entrada') return; // entradas não são "mais vendidos"
      if (!contagem[item.title]) {
        contagem[item.title] = { title: item.title, qty: 0, image: item.image || null };
      }
      contagem[item.title].qty += item.qty;
    });
  });
  return Object.values(contagem).sort((a, b) => b.qty - a.qty);
})();

  return (
    <VendasContext.Provider
      value={{
        vendasHoje,
        carregandoVendas,
        registrarVenda,
        faturamentoDia,
        totalPix,
        totalCartao,
        totalDinheiro,
        maisVendidos,
      }}
    >
      {children}
    </VendasContext.Provider>
  );
}

export function useVendas() {
  const context = useContext(VendasContext);
  if (!context) {
    throw new Error('useVendas deve ser usado dentro de um VendasProvider');
  }
  return context;
}