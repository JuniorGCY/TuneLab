// Depois da compra, o crédito entra quando o webhook do RevenueCat chega na API (alguns
// segundos). O app não soma nada sozinho: só consulta o saldo até ele subir.

export type ResultadoDaEspera =
  | { status: 'creditado'; saldo: number }
  | { status: 'demorou' }; // o pagamento foi aceito, mas o crédito ainda não apareceu

type OpcoesDaEspera = {
  lerSaldo: () => Promise<number>;
  saldoAnterior: number;
  tentativas?: number;
  intervaloMs?: number;
  esperar?: (ms: number) => Promise<void>;
};

const esperarDeVerdade = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function aguardarCreditos({
  lerSaldo,
  saldoAnterior,
  tentativas = 15,
  intervaloMs = 2000,
  esperar = esperarDeVerdade,
}: OpcoesDaEspera): Promise<ResultadoDaEspera> {
  for (let tentativa = 0; tentativa < tentativas; tentativa++) {
    await esperar(intervaloMs);
    try {
      const saldo = await lerSaldo();
      if (saldo > saldoAnterior) return { status: 'creditado', saldo };
    } catch {
      // Falha de rede numa consulta não encerra a espera: tenta de novo na próxima volta.
    }
  }
  return { status: 'demorou' };
}
