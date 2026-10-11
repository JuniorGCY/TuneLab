import { useCallback, useEffect, useRef, useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';

import { useAuth } from '@/contexts/AuthContext';
import { getCreditsAPI } from '@/features/Home/services/getCreditsAPI';
import {
  buscarPacotesDaLoja,
  comprarPacote,
  identificarUsuario,
} from '@/features/purchases/services/revenueCat';
import { montarPacotes, type PacoteDeCreditos } from '@/features/purchases/utils/creditPackages';
import { classificarErroDeCompra, mensagemDoErroDeCompra } from '@/features/purchases/utils/purchaseErrors';
import { aguardarCreditos } from '@/features/purchases/utils/waitForCredits';

export type EtapaDaCompra =
  | { nome: 'carregando' }
  | { nome: 'erro-ao-carregar'; mensagem: string }
  | { nome: 'escolhendo'; pacotes: PacoteDeCreditos[]; erro: string | null }
  | { nome: 'comprando'; pacotes: PacoteDeCreditos[]; pacoteId: string }
  | { nome: 'confirmando' } // pago; esperando o servidor liberar o crédito
  | { nome: 'concluido'; saldo: number }
  | { nome: 'demorou' } // pago, mas o crédito ainda não apareceu
  | { nome: 'pendente' }; // a loja ainda não aprovou o pagamento

const SEM_SERVIDOR = 'Sem conexão com o servidor. Nada foi cobrado. Tente de novo.';

export function useCreditPurchase() {
  const { firebaseUser, getToken } = useAuth();
  const uid = firebaseUser?.uid ?? null;
  const [etapa, setEtapa] = useState<EtapaDaCompra>({ nome: 'carregando' });
  // O SDK precisa do objeto original do pacote para comprar; a tela só conhece o pacoteId.
  const pacotesDaLoja = useRef(new Map<string, PurchasesPackage>());
  // Barra o toque duplo antes de o estado novo chegar na tela: seriam duas cobranças.
  const compraEmAndamento = useRef(false);

  const lerSaldo = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error('Usuário não autenticado');
    return (await getCreditsAPI(token)).creditos;
  }, [getToken]);

  const carregar = useCallback(async () => {
    if (!uid) return;
    setEtapa({ nome: 'carregando' });
    try {
      await identificarUsuario(uid);
      const daLoja = await buscarPacotesDaLoja();
      const pacotes = montarPacotes(daLoja);
      if (pacotes.length === 0) {
        setEtapa({ nome: 'erro-ao-carregar', mensagem: 'Nenhum pacote disponível no momento.' });
        return;
      }
      pacotesDaLoja.current = new Map(daLoja.map((p) => [p.identifier, p]));
      setEtapa({ nome: 'escolhendo', pacotes, erro: null });
    } catch (erro) {
      console.warn('Falha ao carregar pacotes:', erro);
      setEtapa({
        nome: 'erro-ao-carregar',
        mensagem: 'Não foi possível carregar os pacotes. Confira sua conexão e tente de novo.',
      });
    }
  }, [uid]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const comprar = useCallback(
    async (pacoteId: string) => {
      if (compraEmAndamento.current || etapa.nome !== 'escolhendo' || !uid) return;
      const pacote = pacotesDaLoja.current.get(pacoteId);
      if (!pacote) return;
      const { pacotes } = etapa;
      const voltarParaEscolha = (erro: string | null) => setEtapa({ nome: 'escolhendo', pacotes, erro });

      compraEmAndamento.current = true;
      setEtapa({ nome: 'comprando', pacotes, pacoteId });
      try {
        // Saldo de antes, para saber quando o crédito novo entrou. Sem ele não dá para
        // confirmar a compra, então nem abre a loja.
        let saldoAnterior: number;
        try {
          saldoAnterior = await lerSaldo();
        } catch {
          voltarParaEscolha(SEM_SERVIDOR);
          return;
        }

        try {
          await comprarPacote(pacote, uid);
        } catch (erro) {
          const tipo = classificarErroDeCompra(erro);
          if (tipo === 'cancelado') return voltarParaEscolha(null);
          if (tipo === 'pendente') return setEtapa({ nome: 'pendente' });
          console.warn('Falha na compra:', tipo, erro);
          return voltarParaEscolha(mensagemDoErroDeCompra(tipo));
        }

        setEtapa({ nome: 'confirmando' });
        const resultado = await aguardarCreditos({ lerSaldo, saldoAnterior });
        setEtapa(
          resultado.status === 'creditado' ? { nome: 'concluido', saldo: resultado.saldo } : { nome: 'demorou' }
        );
      } finally {
        compraEmAndamento.current = false;
      }
    },
    [etapa, uid, lerSaldo]
  );

  return { etapa, carregar, comprar };
}
