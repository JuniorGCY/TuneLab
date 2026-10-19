// Pede à API a análise grátis do celular verificado. A API lê o número do token do Firebase,
// então o token precisa ser novo (getToken(true)) logo depois de vincular o celular.

export type PhoneBonusResult = {
  // false = esta conta já tinha resgatado antes (não é erro).
  concedido: boolean;
  creditos: number;
};

export async function claimPhoneBonusAPI(userToken: string): Promise<PhoneBonusResult> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/bonus-telefone`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Corpo não-JSON (ex: 401 do http.Error): cai na mensagem genérica abaixo.
  }

  if (!response.ok) {
    const mensagem =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Não foi possível liberar a análise grátis (erro ${response.status}).`;
    throw new Error(mensagem);
  }

  if (
    typeof data !== 'object' || data === null ||
    !('concedido' in data) || typeof data.concedido !== 'boolean' ||
    !('creditos' in data) || typeof data.creditos !== 'number'
  ) {
    throw new Error('Resposta inválida ao liberar a análise grátis.');
  }
  return { concedido: data.concedido, creditos: data.creditos };
}
