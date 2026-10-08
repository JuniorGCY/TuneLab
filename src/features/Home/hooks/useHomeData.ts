import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { listCarsAPI, CarroAPI } from '@/features/Home/services/listCarsAPI';
import { getCreditsAPI } from '@/features/Home/services/getCreditsAPI';

// 'loading' só na primeira carga; depois a lista continua na tela enquanto atualiza.
type CarsStatus = 'loading' | 'ready' | 'error';

export function useHomeData() {
  const { getToken } = useAuth();
  const [carros, setCarros] = useState<CarroAPI[]>([]);
  const [carsStatus, setCarsStatus] = useState<CarsStatus>('loading');
  // null = ainda não carregou ou falhou: o selo mostra "—" em vez de um número errado.
  const [creditos, setCreditos] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const emAndamento = useRef(false);

  const refresh = useCallback(async () => {
    // Evita duas buscas simultâneas (foco + toque no botão ao mesmo tempo).
    if (emAndamento.current) return;
    emAndamento.current = true;
    setIsRefreshing(true);

    try {
      const token = await getToken();
      if (!token) throw new Error('Usuário não autenticado');

      // Carros e créditos são independentes: a falha de um não esconde o outro.
      const [resultadoCarros, resultadoCreditos] = await Promise.allSettled([
        listCarsAPI(token),
        getCreditsAPI(token),
      ]);

      if (resultadoCarros.status === 'fulfilled') {
        setCarros(resultadoCarros.value);
        setCarsStatus('ready');
      } else {
        console.error('Erro ao carregar carros:', resultadoCarros.reason);
        // Se já havia carros na tela, mantém a lista antiga em vez de sumir com ela.
        setCarsStatus((anterior) => (anterior === 'ready' ? 'ready' : 'error'));
      }

      if (resultadoCreditos.status === 'fulfilled') {
        setCreditos(resultadoCreditos.value);
      } else {
        console.error('Erro ao carregar créditos:', resultadoCreditos.reason);
      }
    } catch (error) {
      console.error('Erro ao atualizar a Home:', error);
      setCarsStatus((anterior) => (anterior === 'ready' ? 'ready' : 'error'));
    } finally {
      emAndamento.current = false;
      setIsRefreshing(false);
    }
  }, [getToken]);

  // Atualiza sempre que a tela ganha foco: ao voltar da análise, o carro salvo já aparece.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { carros, carsStatus, creditos, isRefreshing, refresh };
}
