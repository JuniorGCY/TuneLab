// Erros do POST /car/upload que a tela de análise trata de forma especial.

// O backend respondeu 409 porque as fotos não parecem ser do carro digitado. Nenhum crédito
// foi gasto; a tela pode oferecer "Analisar mesmo assim" (confirmVehicle: true).
export class VehicleMismatchError extends Error {
  readonly vehicleInPhotos: string;

  constructor(message: string, vehicleInPhotos: string) {
    super(message);
    this.name = 'VehicleMismatchError';
    this.vehicleInPhotos = vehicleInPhotos;
  }
}

// O backend respondeu 402: a conta não tem crédito. A tela oferece a análise grátis do celular.
export class NoCreditsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoCreditsError';
  }
}

export function isNoCreditsError(error: unknown): error is NoCreditsError {
  return error instanceof Error && error.name === 'NoCreditsError';
}

// Guard por nome em vez de instanceof: subclasses de Error podem perder o protótipo
// dependendo de como o Babel transpila as classes.
export function isVehicleMismatchError(error: unknown): error is VehicleMismatchError {
  return error instanceof Error && error.name === 'VehicleMismatchError';
}

export type UploadErrorBody = {
  error?: unknown;
  message?: unknown;
  codigo?: unknown;
  veiculoNasFotos?: unknown;
};

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

// Traduz uma resposta de erro do /car/upload no erro que a tela sabe tratar.
export function uploadErrorFromResponse(status: number, body: UploadErrorBody): Error {
  const error = asText(body.error);

  if (status === 409 && body.codigo === 'veiculo_divergente') {
    return new VehicleMismatchError(error, asText(body.veiculoNasFotos));
  }

  // 429 por checagens recusadas demais no dia: a checagem automática fica pausada, mas
  // "Analisar mesmo assim" (que pula a checagem e usa 1 crédito) continua liberado.
  if (status === 429 && body.codigo === 'muitas_divergencias') {
    return new VehicleMismatchError(error, '');
  }

  if (status === 402) {
    return new NoCreditsError(error || 'Você não tem créditos de análise disponíveis.');
  }

  return new Error(asText(body.message) || error || `Erro HTTP ${status}`);
}
