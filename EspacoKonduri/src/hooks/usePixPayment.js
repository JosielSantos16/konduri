import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/fireBaseCondig';
import { criarPedidoPix, verificarStatusPix } from '../services/queries/pagBankQueries';

const INTERVALO_VERIFICACAO_MS = 5000;

export function usePixPayment() {
  const [qrCode, setQrCode] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [pago, setPago] = useState(false);
  const [erro, setErro] = useState(null);

  const intervalRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const pararVerificacoes = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (unsubscribeRef.current) unsubscribeRef.current();
    intervalRef.current = null;
    unsubscribeRef.current = null;
  }, []);

  const gerarQrCode = useCallback(
    async ({ vendaId, total, itens, clienteNome, clienteEmail }) => {
      setGerando(true);
      setErro(null);

      try {
        const resultado = await criarPedidoPix({ vendaId, total, itens, clienteNome, clienteEmail });
        setQrCode(resultado);

        unsubscribeRef.current = onSnapshot(doc(db, 'pagamentosPix', resultado.orderId), (snap) => {
          if (snap.exists() && snap.data().status === 'pago') {
            setPago(true);
            pararVerificacoes();
          }
        });

        intervalRef.current = setInterval(async () => {
          try {
            const status = await verificarStatusPix(resultado.orderId);
            if (status.status === 'pago') {
              setPago(true);
              pararVerificacoes();
            }
          } catch (e) {
            console.error('Erro ao verificar status Pix:', e);
          }
        }, INTERVALO_VERIFICACAO_MS);
      } catch (e) {
        console.error('Erro ao gerar QR Code Pix:', e);
        setErro('Não foi possível gerar o QR Code Pix. Tente novamente.');
      } finally {
        setGerando(false);
      }
    },
    [pararVerificacoes]
  );

  const reiniciar = useCallback(() => {
    pararVerificacoes();
    setQrCode(null);
    setPago(false);
    setErro(null);
  }, [pararVerificacoes]);

  useEffect(() => {
    return () => pararVerificacoes();
  }, [pararVerificacoes]);

  return { qrCode, gerando, pago, erro, gerarQrCode, reiniciar };
}