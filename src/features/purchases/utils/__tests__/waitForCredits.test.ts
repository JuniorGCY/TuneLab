import { describe, expect, it, jest } from '@jest/globals';
import { aguardarCreditos } from '../waitForCredits';

const semEspera = () => Promise.resolve();

describe('aguardarCreditos', () => {
  it('termina assim que o saldo sobe', async () => {
    const lerSaldo = jest.fn<() => Promise<number>>().mockResolvedValueOnce(2).mockResolvedValueOnce(2).mockResolvedValueOnce(7);

    const resultado = await aguardarCreditos({ lerSaldo, saldoAnterior: 2, esperar: semEspera });

    expect(resultado).toEqual({ status: 'creditado', saldo: 7 });
    expect(lerSaldo).toHaveBeenCalledTimes(3);
  });

  it('desiste depois das tentativas sem prometer erro', async () => {
    const lerSaldo = jest.fn<() => Promise<number>>().mockResolvedValue(2);

    const resultado = await aguardarCreditos({ lerSaldo, saldoAnterior: 2, tentativas: 4, esperar: semEspera });

    expect(resultado).toEqual({ status: 'demorou' });
    expect(lerSaldo).toHaveBeenCalledTimes(4);
  });

  it('continua tentando quando uma consulta falha', async () => {
    const lerSaldo = jest.fn<() => Promise<number>>().mockRejectedValueOnce(new Error('sem rede')).mockResolvedValueOnce(5);

    const resultado = await aguardarCreditos({ lerSaldo, saldoAnterior: 0, esperar: semEspera });

    expect(resultado).toEqual({ status: 'creditado', saldo: 5 });
  });

  it('espera o intervalo antes de cada consulta', async () => {
    const esperar = jest.fn(semEspera);
    const lerSaldo = jest.fn<() => Promise<number>>().mockResolvedValue(1);

    await aguardarCreditos({ lerSaldo, saldoAnterior: 0, intervaloMs: 1500, esperar });

    expect(esperar).toHaveBeenCalledWith(1500);
  });

  it('não confunde saldo menor (crédito gasto em outra análise) com crédito novo', async () => {
    const lerSaldo = jest.fn<() => Promise<number>>().mockResolvedValueOnce(1).mockResolvedValueOnce(6);

    const resultado = await aguardarCreditos({ lerSaldo, saldoAnterior: 2, esperar: semEspera });

    expect(resultado).toEqual({ status: 'creditado', saldo: 6 });
  });
});
