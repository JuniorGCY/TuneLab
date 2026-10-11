// Monta os pacotes de créditos para a tela a partir do que a loja devolveu.
//
// A quantidade aqui é só para EXIBIR ("5 análises"). Quem decide quantos créditos a compra
// libera é o servidor (compras.CreditosPorProduto na API). Se os dois divergirem, vale o servidor.

export const CREDITOS_POR_PRODUTO: Readonly<Record<string, number>> = {
  tunelab_creditos_1: 1,
  tunelab_creditos_5: 5,
  tunelab_creditos_15: 15,
};

// O pacote do meio é a âncora da tabela de preços (ver monetizacao.md).
const PRODUTO_EM_DESTAQUE = 'tunelab_creditos_5';

// Formato mínimo de um pacote da loja (PurchasesPackage do RevenueCat), para este arquivo
// não depender do SDK e poder ser testado sem o módulo nativo.
export type PacoteDaLoja = {
  identifier: string;
  product: {
    identifier: string;
    priceString: string;
    price: number;
    currencyCode: string;
  };
};

export type PacoteDeCreditos = {
  pacoteId: string;
  produtoId: string;
  creditos: number;
  titulo: string;
  preco: string;
  precoPorAnalise: string | null; // null quando é o pacote de 1 (não faz sentido repetir o preço)
  destaque: boolean;
};

// Ignora produto que o app não conhece (ex: cadastrado no painel antes de atualizar o app)
// e ordena do menor para o maior pacote.
export function montarPacotes(pacotesDaLoja: readonly PacoteDaLoja[]): PacoteDeCreditos[] {
  return pacotesDaLoja
    .flatMap((pacote) => {
      const creditos = CREDITOS_POR_PRODUTO[pacote.product.identifier];
      if (!creditos) return [];
      return [
        {
          pacoteId: pacote.identifier,
          produtoId: pacote.product.identifier,
          creditos,
          titulo: creditos === 1 ? '1 análise' : `${creditos} análises`,
          preco: pacote.product.priceString,
          precoPorAnalise:
            creditos > 1
              ? formatarPreco(pacote.product.price / creditos, pacote.product.currencyCode)
              : null,
          destaque: pacote.product.identifier === PRODUTO_EM_DESTAQUE,
        },
      ];
    })
    .sort((a, b) => a.creditos - b.creditos);
}

function formatarPreco(valor: number, moeda: string): string | null {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda }).format(valor);
  } catch {
    // Moeda inválida ou Intl indisponível: melhor esconder o "por análise" do que mostrar errado.
    return null;
  }
}
