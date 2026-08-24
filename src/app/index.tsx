import { Redirect } from 'expo-router';

export default function Index() {
  // Tenta acessar a área principal do app.
  // O controlador no _layout.tsx interceptará o acesso e decidirá 
  // se o usuário vai para as tabs ou para a tela de login.
  return <Redirect href="/(tabs)" />;
}