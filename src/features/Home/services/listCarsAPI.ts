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

export async function deleteCarAPI(token: string, carId: number): Promise<void> {
    try {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/cars/delete?id=${carId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Erro ao deletar veículo');
        }
    } catch (err) {
        console.error('deleteCarAPI error:', err);
        throw err;
    }
}

export async function updateCarAPI(
    token: string, 
    carId: number, 
    titulo: string, 
    descricao: string, 
    hp: number
): Promise<void> {
    try {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/cars/update`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: carId,
                titulo,
                descricao,
                hp
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Erro ao atualizar veículo');
        }
    } catch (err) {
        console.error('updateCarAPI error:', err);
        throw err;
    }
}