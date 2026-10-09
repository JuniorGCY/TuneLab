// Busca o saldo de créditos de análise do usuário logado.

import { fetch } from 'expo/fetch';

export type CreditsInfo = {
  creditos: number;
  // true = a conta ainda pode ganhar a análise grátis confirmando o celular.
  bonusDisponivel: boolean;
};

export async function getCreditsAPI(userToken: string): Promise<CreditsInfo> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/usuario/creditos`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro ao buscar créditos (status ${response.status})`);
  }

  const data: Partial<CreditsInfo> = await response.json();
  if (typeof data.creditos !== 'number') {
    throw new Error('Resposta de créditos inválida');
  }
  return { creditos: data.creditos, bonusDisponivel: data.bonusDisponivel === true };
}
