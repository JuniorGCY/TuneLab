import { describe, expect, it } from '@jest/globals';
import {
  isNoCreditsError,
  isVehicleMismatchError,
  uploadErrorFromResponse,
} from '../uploadErrors';

describe('uploadErrorFromResponse', () => {
  it('409 veiculo_divergente vira VehicleMismatchError com o carro das fotos', () => {
    const erro = uploadErrorFromResponse(409, {
      error: 'As fotos parecem ser de um Polo',
      codigo: 'veiculo_divergente',
      veiculoNasFotos: 'Volkswagen Polo',
    });
    expect(isVehicleMismatchError(erro)).toBe(true);
    expect(erro.message).toBe('As fotos parecem ser de um Polo');
    expect(isVehicleMismatchError(erro) && erro.vehicleInPhotos).toBe('Volkswagen Polo');
  });

  it('429 muitas_divergencias também oferece "Analisar mesmo assim"', () => {
    const erro = uploadErrorFromResponse(429, {
      error: 'As fotos não bateram várias vezes hoje.',
      codigo: 'muitas_divergencias',
    });
    expect(isVehicleMismatchError(erro)).toBe(true);
    expect(erro.message).toBe('As fotos não bateram várias vezes hoje.');
  });

  it('429 muitas_analises é um erro comum com a mensagem do servidor', () => {
    const erro = uploadErrorFromResponse(429, {
      error: 'Você fez muitas análises na última hora. Tente de novo em 10 min.',
      codigo: 'muitas_analises',
    });
    expect(isVehicleMismatchError(erro)).toBe(false);
    expect(isNoCreditsError(erro)).toBe(false);
    expect(erro.message).toMatch(/10 min/);
  });

  it('402 vira NoCreditsError, com mensagem padrão se vier vazia', () => {
    const erro = uploadErrorFromResponse(402, {});
    expect(isNoCreditsError(erro)).toBe(true);
    expect(erro.message).toMatch(/créditos/);
  });

  it('outros status usam message, depois error, depois o status', () => {
    expect(uploadErrorFromResponse(500, { message: 'a', error: 'b' }).message).toBe('a');
    expect(uploadErrorFromResponse(503, { error: 'b' }).message).toBe('b');
    expect(uploadErrorFromResponse(500, {}).message).toBe('Erro HTTP 500');
  });

  it('ignora campos que não são texto', () => {
    expect(uploadErrorFromResponse(500, { error: 42 }).message).toBe('Erro HTTP 500');
  });
});
