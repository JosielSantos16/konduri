import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/fireBaseCondig";
import { buscarPerfilUsuario } from "../services/queries/usuariosQueries";
import { registrarPushToken } from "../services/notificacoes/registrarPushToken";

// O useAuth roda em quase toda tela; o token de push só precisa ser
// registrado uma vez por usuário enquanto o app está aberto
const pushRegistradoPara = new Set();

// Último perfil carregado, guardado enquanto o app está aberto. Sem isso cada
// tela esperava uma ida ao Firestore antes de mostrar qualquer coisa (as
// notificações, por exemplo, só começavam a carregar depois do perfil).
// A tela usa o perfil guardado na hora e atualiza em segundo plano.
let perfilEmCache = null;

function perfilGuardadoDoUsuarioAtual() {
  const uid = auth.currentUser?.uid;
  return uid && perfilEmCache?.uid === uid ? perfilEmCache : null;
}

export function useAuth() {
  const [usuario, setUsuario] = useState(perfilGuardadoDoUsuarioAtual);
  const [carregando, setCarregando] = useState(() => !perfilGuardadoDoUsuarioAtual());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        perfilEmCache = null;
        setUsuario(null);
        setCarregando(false);
        return;
      }

      if (perfilEmCache?.uid === firebaseUser.uid) {
        setUsuario(perfilEmCache);
        setCarregando(false);
      }

      if (!pushRegistradoPara.has(firebaseUser.uid)) {
        pushRegistradoPara.add(firebaseUser.uid);
        registrarPushToken(firebaseUser.uid).catch((erro) => {
          pushRegistradoPara.delete(firebaseUser.uid);
          console.error("Erro ao registrar notificações push:", erro);
        });
      }

      try {
        const perfil = await buscarPerfilUsuario(firebaseUser.uid);
        perfilEmCache = perfil;
        setUsuario(perfil);
      } catch (erro) {
        console.error("Erro ao buscar perfil do usuário:", erro);
        // Sem internet: mantém o perfil guardado, se houver
        if (perfilEmCache?.uid !== firebaseUser.uid) setUsuario(null);
      } finally {
        setCarregando(false);
      }
    });

    return unsubscribe;
  }, []);

  // Recarrega os dados do perfil sob demanda — usado no pull-to-refresh
  const refetchUsuario = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const perfil = await buscarPerfilUsuario(auth.currentUser.uid);
      perfilEmCache = perfil;
      setUsuario(perfil);
    } catch (erro) {
      console.error("Erro ao recarregar perfil:", erro);
    }
  }, []);

  return { usuario, carregando, refetchUsuario };
}