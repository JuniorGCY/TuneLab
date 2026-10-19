import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  verifyPhoneNumber,
} from '@react-native-firebase/auth';

import { useAuth } from '@/contexts/AuthContext';
import { getErrorCode, getFirebaseErrorMessage } from '@/utils/FirebaseErrors';
import { claimPhoneBonusAPI } from '../services/claimPhoneBonusAPI';
import { toBrazilE164 } from '../utils/phoneNumber';

const RESEND_COOLDOWN_SECONDS = 60;

export type PhoneVerificationStep =
  | { name: 'phone' }
  | { name: 'code'; phoneE164: string; verificationId: string }
  // Celular já vinculado; falta (ou falhou) o pedido do bônus à API.
  | { name: 'claim' }
  | { name: 'done'; granted: boolean; credits: number };

// Fluxo: celular -> SMS -> código -> vincula o celular à conta Google -> pede o bônus à API.
// O vínculo é feito no Firebase (linkWithCredential); a API só confia no número que vem no token.
export function usePhoneVerification() {
  const { getToken } = useAuth();
  const jaTemCelular = !!getAuth().currentUser?.phoneNumber;

  const [step, setStep] = useState<PhoneVerificationStep>(
    jaTemCelular ? { name: 'claim' } : { name: 'phone' }
  );
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendInSeconds, setResendInSeconds] = useState(0);

  // Cada envio de SMS ganha um número; eventos de um envio antigo são ignorados.
  const envioAtual = useRef(0);
  // Evita vincular duas vezes (verificação automática do Android + código digitado).
  const vinculando = useRef(false);

  useEffect(() => {
    if (resendInSeconds <= 0) return;
    const timer = setTimeout(() => setResendInSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendInSeconds]);

  const claim = useCallback(async () => {
    setError('');
    setIsBusy(true);
    try {
      const token = await getToken(true); // token novo, com a claim phone_number
      if (!token) throw new Error('Sua sessão expirou. Entre de novo.');
      const resultado = await claimPhoneBonusAPI(token);
      setStep({ name: 'done', granted: resultado.concedido, credits: resultado.creditos });
    } catch (e) {
      // O celular já está vinculado: basta tentar o resgate de novo (a API é idempotente).
      setStep({ name: 'claim' });
      console.warn('Falha ao resgatar o bônus:', e);
      setError(e instanceof Error ? e.message : 'Não foi possível liberar a análise grátis.');
    } finally {
      setIsBusy(false);
    }
  }, [getToken]);

  const linkAndClaim = useCallback(async (verificationId: string, code: string) => {
    if (vinculando.current) return;
    vinculando.current = true;
    setError('');
    setIsBusy(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error('Sua sessão expirou. Entre de novo.');
      await linkWithCredential(user, PhoneAuthProvider.credential(verificationId, code));
    } catch (e) {
      const codigo = getErrorCode(e);
      console.warn('Falha ao vincular o celular:', codigo || e);
      // Conta que já tinha celular vinculado: segue para o resgate com ele.
      if (codigo !== 'auth/provider-already-linked') {
        setError(codigo ? getFirebaseErrorMessage(codigo) : 'Não foi possível confirmar o código.');
        setIsBusy(false);
        vinculando.current = false;
        return;
      }
    }
    vinculando.current = false;
    await claim();
  }, [claim]);

  const startVerification = useCallback((phoneE164: string, forceResend: boolean) => {
    const envio = ++envioAtual.current;
    setError('');
    setIsBusy(true);

    verifyPhoneNumber(getAuth(), phoneE164, forceResend).on('state_changed', (snapshot) => {
      if (envio !== envioAtual.current) return;

      switch (snapshot.state) {
        case 'sent':
          setStep({ name: 'code', phoneE164, verificationId: snapshot.verificationId });
          setResendInSeconds(RESEND_COOLDOWN_SECONDS);
          setIsBusy(false);
          break;
        case 'verified':
          // Android leu o SMS sozinho. Sem o código (verificação instantânea) não dá para
          // vincular: a pessoa pede um novo SMS.
          if (snapshot.code) {
            linkAndClaim(snapshot.verificationId, snapshot.code);
          } else {
            setStep({ name: 'code', phoneE164, verificationId: snapshot.verificationId });
            setError('Não conseguimos confirmar automaticamente. Toque em "Reenviar código".');
            setResendInSeconds(0);
            setIsBusy(false);
          }
          break;
        case 'error':
          // Só o código e a mensagem do Firebase; o número do celular não vai para o log.
          console.warn('Falha ao enviar o SMS:', snapshot.error?.code, snapshot.error?.message);
          setError(getFirebaseErrorMessage(snapshot.error?.code ?? ''));
          setIsBusy(false);
          break;
        // 'timeout': o Android desistiu de ler o SMS sozinho; a pessoa digita o código.
      }
    });
  }, [linkAndClaim]);

  const sendCode = useCallback((phoneText: string) => {
    const phoneE164 = toBrazilE164(phoneText);
    if (!phoneE164) {
      setError('Digite um celular com DDD, por exemplo (11) 98765-4321.');
      return;
    }
    startVerification(phoneE164, false);
  }, [startVerification]);

  const resendCode = useCallback(() => {
    if (step.name !== 'code' || resendInSeconds > 0) return;
    startVerification(step.phoneE164, true);
  }, [step, resendInSeconds, startVerification]);

  const confirmCode = useCallback((code: string) => {
    if (step.name !== 'code') return;
    const digitos = code.replace(/\D/g, '');
    if (digitos.length !== 6) {
      setError('O código tem 6 números.');
      return;
    }
    linkAndClaim(step.verificationId, digitos);
  }, [step, linkAndClaim]);

  const changeNumber = useCallback(() => {
    envioAtual.current++; // descarta eventos do envio anterior
    setError('');
    setIsBusy(false);
    setStep({ name: 'phone' });
  }, []);

  return { step, isBusy, error, resendInSeconds, sendCode, resendCode, confirmCode, changeNumber, claim };
}
