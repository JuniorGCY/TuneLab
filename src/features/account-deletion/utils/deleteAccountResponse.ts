// Traduz a resposta do DELETE /usuario. Fica separado do fetch para ser testável.

export const RECENT_LOGIN_CODE = 'login_recente_necessario';

export type DeleteAccountOutcome =
  | { kind: 'deleted' }
  // O login com o Google é antigo demais: o app precisa pedir para entrar de novo.
  | { kind: 'recent-login-required' }
  | { kind: 'failed'; message: string };

const GENERIC_MESSAGE = 'Não foi possível excluir a conta agora. Tente de novo em instantes.';

export function parseDeleteAccountResponse(status: number, bodyText: string): DeleteAccountOutcome {
  if (status === 204 || status === 200) return { kind: 'deleted' };

  let body: unknown = null;
  try {
    body = JSON.parse(bodyText);
  } catch {
    // Corpo não-JSON (ex: 401 do http.Error): cai na mensagem genérica.
  }

  const codigo = readString(body, 'codigo');
  if (status === 403 && codigo === RECENT_LOGIN_CODE) {
    return { kind: 'recent-login-required' };
  }
  if (status === 401) {
    return { kind: 'failed', message: 'Sua sessão expirou. Entre de novo e tente outra vez.' };
  }
  return { kind: 'failed', message: readString(body, 'error') ?? GENERIC_MESSAGE };
}

function readString(body: unknown, key: string): string | undefined {
  if (typeof body !== 'object' || body === null || !(key in body)) return undefined;
  const value: unknown = (body as Record<string, unknown>)[key];
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}
