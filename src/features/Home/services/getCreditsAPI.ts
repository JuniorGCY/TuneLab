// Busca o saldo de créditos de análise do usuário logado.

import { fetch } from 'expo/fetch';

type CreditsResponse = {
  creditos: number;
};

export async function getCreditsAPI(userToken: string): Promise<number> {
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

  const data: CreditsResponse = await response.json();
  if (typeof data.creditos !== 'number') {
    throw new Error('Resposta de créditos inválida');
  }
  return data.creditos;
}
