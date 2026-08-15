import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeContainer from '../../styles/SafeContainer';
import { listarProdutosDaOperacao } from '../../services/queries/operacoesQueries';
import ProdutoControleCard from '../../components/controleDoDia/ProdutoControleCard';
import {
  Container,
  Header,
  HeaderLeft,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderDate,
  UserBadge,
  UserBadgeText,
  SectionHeader,
  SectionTitle,
  AddButton,
  ProductsList,
  EmptyState,
  EmptyStateText,
  FecharCaixaButton,
  FecharCaixaButtonText,
} from './controleDoDiaStyle';

export default function ControleDoDia() {
  const router = useRouter();
  const { operacaoId, responsavelNome, data } = useLocalSearchParams();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const lista = await listarProdutosDaOperacao(operacaoId);
        setProdutos(lista);
      } catch (erro) {
        console.error('Erro ao carregar produtos da operação:', erro);
      } finally {
        setCarregando(false);
      }
    }

    if (operacaoId) carregarProdutos();
  }, [operacaoId]);

  const primeiroNome = responsavelNome ? responsavelNome.split(' ')[0] + (responsavelNome.split(' ')[1] ? ' ' + responsavelNome.split(' ')[1][0] + '.' : '') : '';

  const handleEditarProduto = (produto) => {
    router.push({
      pathname: '/controle-do-dia/editar-produto',
      params: { operacaoId, produtoId: produto.id },
    });
  };

  const handleAdicionarProduto = () => {
  router.push({
    pathname: '/novo-produto',
    params: { operacaoId },
  });
};

const handleFecharCaixa = () => {
  router.push({
    pathname: '/fechamento',
    params: { operacaoId, data },
  });
};

  return (
    <SafeContainer>
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
            </BackButton>
            <HeaderTitles>
              <HeaderTitle>Controle do Dia</HeaderTitle>
              <HeaderDate>{data}</HeaderDate>
            </HeaderTitles>
          </HeaderLeft>

          <UserBadge>
            <Ionicons name="person" size={14} color="#2E5A1E" />
            <UserBadgeText>{primeiroNome}</UserBadgeText>
          </UserBadge>
        </Header>

        <SectionHeader>
          <SectionTitle>PRODUTOS ATIVOS ({produtos.length})</SectionTitle>
          <AddButton onPress={handleAdicionarProduto}>
            <Ionicons name="add-circle-outline" size={24} color="#2E5A1E" />
          </AddButton>
        </SectionHeader>

        <ProductsList showsVerticalScrollIndicator={false}>
          {!carregando && produtos.length === 0 && (
            <EmptyState>
              <Ionicons name="cube-outline" size={40} color="#C9BBA8" />
              <EmptyStateText>
                Nenhum produto na operação ainda.{'\n'}Toque no + para adicionar.
              </EmptyStateText>
            </EmptyState>
          )}

          {produtos.map((produto) => (
            <ProdutoControleCard
              key={produto.id}
              produto={produto}
              onEdit={() => handleEditarProduto(produto)}
            />
          ))}
        </ProductsList>

        <FecharCaixaButton onPress={handleFecharCaixa}>
          <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />
          <FecharCaixaButtonText>Fechar Caixa do Dia</FecharCaixaButtonText>
        </FecharCaixaButton>
      </Container>
    </SafeContainer>
  );
}