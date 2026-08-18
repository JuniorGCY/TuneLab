import { Redirect } from 'expo-router';

export default function Index() {
  // Por enquanto, sempre manda pro login
  return <Redirect href="/(tabs)" />;
}