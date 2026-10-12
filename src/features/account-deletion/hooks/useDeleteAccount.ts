import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { getErrorCode, getFirebaseErrorMessage } from '@/utils/FirebaseErrors';
import { deleteAccountAPI } from '../services/deleteAccountAPI';

export type DeleteAccountStep = 'idle' | 'reauthenticating' | 'deleting' | 'deleted';

// Fluxo: entrar de novo com o Google -> token novo -> DELETE /usuario -> limpar a sessão.
// Ao limpar a sessão, o _layout leva para a tela de login sozinho.
export function useDeleteAccount() {
  const { reauthenticateWithGoogle, getToken, clearSessionAfterAccountDeletion } = useAuth();
  const [step, setStep] = useState<DeleteAccountStep>('idle');
  const [error, setError] = useState('');
  // Trava de toque duplo: o estado do React ainda não mudou no segundo toque.
  const emAndamento = useRef(false);

  const deleteAccount = useCallback(async () => {
    if (emAndamento.current) return;
    emAndamento.current = true;
    setError('');

    try {
      setStep('reauthenticating');
      const login = await reauthenticateWithGoogle();
      if (login === 'cancelled') {
        setStep('idle');
        return;
      }

      setStep('deleting');
      const token = await getToken(true); // token novo, com o auth_time do login de agora
      if (!token) throw new Error('Sua sessão expirou. Entre de novo.');

      const resultado = await deleteAccountAPI(token);
      if (resultado.kind === 'recent-login-required') {
        throw new Error('Por segurança, entre de novo com o Google e tente outra vez.');
      }
      if (resultado.kind === 'failed') {
        throw new Error(resultado.message);
      }

      // A conta já não existe no servidor: daqui em diante nada pode voltar a 'idle'.
      setStep('deleted');
      try {
        await clearSessionAfterAccountDeletion();
      } catch (e) {
        console.warn('Conta excluída, mas a sessão local não fechou:', e);
      }
      return;
    } catch (e) {
      console.warn('Falha ao excluir a conta:', getErrorCode(e) || e);
      const codigo = getErrorCode(e);
      setError(codigo ? getFirebaseErrorMessage(codigo) : e instanceof Error ? e.message : 'Não foi possível excluir a conta.');
      setStep('idle');
    } finally {
      emAndamento.current = false;
    }
  }, [reauthenticateWithGoogle, getToken, clearSessionAfterAccountDeletion]);

  return { step, error, isBusy: step !== 'idle', deleteAccount };
}
