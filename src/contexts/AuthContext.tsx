import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  GoogleAuthProvider,
  type User,
} from '@react-native-firebase/auth';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

export interface DBUser {
  id: number;
  nome: string;
  email: string;
  perfil_url: string;
  nivel: number;
  tag: string;
}

// 'cancelled' = o usuário fechou a escolha de conta; não é erro e não mostra mensagem.
export type GoogleSignInResult = 'signed-in' | 'cancelled';

interface AuthContextData {
  firebaseUser: User | null;
  dbUser: DBUser | null;
  isLoading: boolean;
  getToken: (forceRefresh?: boolean) => Promise<string | null>;
  signInWithGoogle: () => Promise<GoogleSignInResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// O webClientId é o "Web client" do OAuth do Firebase (client_type 3 no google-services.json).
// Não é segredo: ele só diz para qual projeto o Google deve emitir o idToken.
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sincronizarComBackend = async (user: User) => {
    try {
      const token = await user.getIdToken();

      const resposta = await fetch(`${API_URL}/auth/sincronizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: user.displayName || 'Entusiasta',
          email: user.email,
        }),
      });

      if (resposta.status === 401 || resposta.status === 403) {
        console.error("Acesso revogado pelo backend.");
        await signOut(getAuth());
        setDbUser(null);
        return;
      }

      if (!resposta.ok) {
        throw new Error(`Erro no servidor Go: Status ${resposta.status}`);
      }

      const dadosDoBanco: DBUser = await resposta.json();
      setDbUser(dadosDoBanco);

    } catch (error) {
      console.warn("Não foi possível sincronizar com o banco de dados no momento:", error);
    }
  };

  useEffect(() => {
    const authInstance = getAuth();

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        await sincronizarComBackend(currentUser);
      } else {
        setDbUser(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Estável (useCallback) para poder entrar em dependências de hooks sem refazer efeitos.
  // Sem forceRefresh usa o token em cache (renovado sozinho perto de expirar). Com true,
  // busca um token novo: necessário logo depois de vincular o celular, para a claim
  // "phone_number" chegar à API.
  const getToken = useCallback(async (forceRefresh = false) => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken(forceRefresh);
  }, []);

  // A sincronização com a API acontece no onAuthStateChanged, como em qualquer login.
  const signInWithGoogle = useCallback(async (): Promise<GoogleSignInResult> => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const resposta = await GoogleSignin.signIn();
    if (!isSuccessResponse(resposta)) return 'cancelled';

    const { idToken } = resposta.data;
    if (!idToken) {
      // Acontece quando o webClientId está errado ou faltando.
      throw new Error('O Google não devolveu o idToken. Confira EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.');
    }

    await signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken));
    return 'signed-in';
  }, []);

  const logout = useCallback(async () => {
    await signOut(getAuth());
    // Sem isso, o próximo "Entrar com Google" reaproveita a conta anterior sem perguntar.
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Falha ao sair da conta Google:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ firebaseUser, dbUser, isLoading, getToken, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
