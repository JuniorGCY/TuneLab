//Responsável por buscar a lista de carros na API

import { fetch } from 'expo/fetch';

export interface CarroAPI {
  id: number;
  titulo: string;
  descricao: string;
  hp: number;
  imageUrl: string;
}

export async function listCarsAPI(userToken: string): Promise<CarroAPI[]> {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cars/list`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Erro ao buscar carros (status ${response.status})`);
    }

    const data: CarroAPI[] = await response.json();
    return data;
  } catch (err) {
    console.log('listCarsAPI error:', err);
    throw err;
  }
}