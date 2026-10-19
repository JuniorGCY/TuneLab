// Reesponsável por enviar os dados do carro (texto) para a API e salvar no banco de dados

import { fetch } from 'expo/fetch';

interface CarroPayload {
  titulo: string;
  descricao: string;
  hp: number;
  imageUrl: string;
  imagemModificadaUrl?: string;
  setup_ia: any;
}

export async function createCarAPI(payload: CarroPayload, userToken: string) {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cars/create`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || `Erro ao salvar no banco (status ${response.status})`);
    }

    return JSON.parse(text);
  } catch (err: any) {
    console.log('createCarAPI error:', err);
    throw err;
  }
}
