import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { subscribeToProducts, criarProduto as criarProdutoQuery, excluirProduto as excluirProdutoQuery } from '../services/queries/productsQueries';
import { uploadProductImage } from '../services/queries/storageQueries';
import { useAuth } from '../hooks/useAuth';

const ProdutosContext = createContext(null);

export function ProdutosProvider({ children }) {
  const { usuario } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setProdutos([]);
      setCarregandoProdutos(false);
      return;
    }

    setCarregandoProdutos(true);
    const unsubscribe = subscribeToProducts((lista) => {
      setProdutos(lista);
      setCarregandoProdutos(false);
    });

    return unsubscribe;
  }, [usuario]);

  const criarProduto = useCallback(async (dadosProduto, fotoLocalUri) => {
    let urlImagem = null;

    if (fotoLocalUri) {
      urlImagem = await uploadProductImage(fotoLocalUri);
    }

    const { id } = await criarProdutoQuery({ ...dadosProduto, image: urlImagem });

    return { id };
  }, []);

  const excluirProduto = useCallback(async (produtoId) => {
    await excluirProdutoQuery(produtoId);
  }, []);

  return (
    <ProdutosContext.Provider value={{ produtos, carregandoProdutos, criarProduto, excluirProduto }}>
      {children}
    </ProdutosContext.Provider>
  );
}

export function useProdutos() {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de um ProdutosProvider');
  }
  return context;
}