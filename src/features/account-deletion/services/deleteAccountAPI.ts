// Pede à API para excluir a conta logada (fotos, carros, saldo e login no Firebase).
// O token precisa vir de um login recente com o Google: a API recusa tokens de login antigo.

import { fetch } from 'expo/fetch';
import { parseDeleteAccountResponse, type DeleteAccountOutcome } from '../utils/deleteAccountResponse';

export async function deleteAccountAPI(userToken: string): Promise<DeleteAccountOutcome> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  });
  const text = await response.text();
  return parseDeleteAccountResponse(response.status, text);
}
