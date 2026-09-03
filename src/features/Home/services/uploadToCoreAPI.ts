//Responsável por enviar a imagem do carro para a API e receber a URL da imagem salva no servidor

import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

export async function uploadToCoreAPI(imageUri: string, userToken?: string) {
  try {
    console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
    console.log('Image URI:', imageUri);

    const file = new File(imageUri);
    console.log('File criado:', file.uri, 'exists?', file.exists);

    const formData = new FormData();
    formData.append('file', file);

    const url = `${process.env.EXPO_PUBLIC_API_URL}/car/upload`;
    console.log('POST →', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
      },
      body: formData,
    });

    console.log('Status:', response.status);

    const text = await response.text();
    console.log('Resposta bruta:', text);

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || `Resposta inválida (status ${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
    }

    if (!data.imageUrl) {
      throw new Error('Servidor não retornou imageUrl');
    }

    return data.imageUrl as string;
  } catch (err: any) {
    console.log('uploadToCoreAPI error:', err);
    throw err;
  }
}