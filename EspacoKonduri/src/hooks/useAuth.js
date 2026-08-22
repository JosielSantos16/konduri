import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/fireBaseCondig";
import { buscarPerfilUsuario } from "../services/queries/usuariosQueries";
import { registrarPushToken } from "../services/notificacoes/registrarPushToken";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUsuario(null);
        setCarregando(false);
        return;
      }

      registrarPushToken(firebaseUser.uid);

      try {
        const perfil = await buscarPerfilUsuario(firebaseUser.uid);
        setUsuario(perfil);
      } catch (erro) {
        console.error("Erro ao buscar perfil do usuário:", erro);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    });

    return unsubscribe;
  }, []);

  return { usuario, carregando };
}