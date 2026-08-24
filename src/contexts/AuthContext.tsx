import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from '@react-native-firebase/auth';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authInstance = getAuth();

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return null;

    return await currentUser.getIdToken(true);
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(getAuth(), email, pass);
  };

  const register = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(getAuth(), email, pass);
  };

  const logout = async () => {
    await signOut(getAuth());
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, getToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}