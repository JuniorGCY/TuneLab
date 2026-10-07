import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from '@react-native-firebase/auth';

export interface DBUser {
  id: number;
  nome: string;
  email: string;
  perfil_url: string;
  nivel: number;
  tag: string;
}

interface AuthContextData {
  firebaseUser: User | null;
  dbUser: DBUser | null;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sincronizarComBackend = async (user: User, nomeOpcional?: string) => {
  try {
    const token = await user.getIdToken();

    const resposta = await fetch(`${API_URL}/auth/sincronizar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        nome: nomeOpcional || user.displayName || 'Entusiasta',
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
  // getIdToken() sem "true" usa o token em cache e o renova sozinho perto de expirar;
  // com "true" cada chamada à API fazia antes uma ida extra aos servidores do Google.
  const getToken = useCallback(async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(getAuth(), email, pass);
  };

  const register = async (email: string, pass: string, name?: string) => {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, pass);
    
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      await sincronizarComBackend(userCredential.user, name);
    }
  };

  const logout = async () => {
    await signOut(getAuth());
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, dbUser, isLoading, getToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}