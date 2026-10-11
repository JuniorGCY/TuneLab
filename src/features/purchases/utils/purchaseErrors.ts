// Traduz os erros de compra do RevenueCat para o que a tela precisa fazer.

export type TipoDeErroDeCompra =
  | 'cancelado' // o usuário fechou a folha da loja: não é erro, não mostra mensagem
  | 'pendente' // pagamento aguardando aprovação (ex: boleto, cartão em análise)
  | 'sem-rede'
  | 'nao-permitido' // compras bloqueadas no aparelho (controle dos pais, conta da loja)
  | 'indisponivel' // produto fora da loja ou SDK mal configurado
  | 'desconhecido';

// Valores de PURCHASES_ERROR_CODE do react-native-purchases. Repetidos aqui (e não importados)
// para este arquivo não carregar o módulo nativo nos testes.
const CODIGOS: Readonly<Record<string, TipoDeErroDeCompra>> = {
  '1': 'cancelado', // PURCHASE_CANCELLED_ERROR
  '20': 'pendente', // PAYMENT_PENDING_ERROR
  '10': 'sem-rede', // NETWORK_ERROR
  '3': 'nao-permitido', // PURCHASE_NOT_ALLOWED_ERROR
  '5': 'indisponivel', // PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR
  '11': 'indisponivel', // INVALID_CREDENTIALS_ERROR
  '23': 'indisponivel', // CONFIGURATION_ERROR
};

export function classificarErroDeCompra(erro: unknown): TipoDeErroDeCompra {
  if (typeof erro !== 'object' || erro === null) return 'desconhecido';
  if ('userCancelled' in erro && erro.userCancelled === true) return 'cancelado';
  if ('code' in erro && (typeof erro.code === 'string' || typeof erro.code === 'number')) {
    return CODIGOS[String(erro.code)] ?? 'desconhecido';
  }
  return 'desconhecido';
}

export function mensagemDoErroDeCompra(tipo: Exclude<TipoDeErroDeCompra, 'cancelado' | 'pendente'>): string {
  switch (tipo) {
    case 'sem-rede':
      return 'Sem conexão com a internet. Nada foi cobrado. Tente de novo.';
    case 'nao-permitido':
      return 'Compras estão bloqueadas neste aparelho ou na sua conta da Google Play.';
    case 'indisponivel':
      return 'Este pacote está indisponível no momento. Tente novamente mais tarde.';
    case 'desconhecido':
      return 'Não foi possível concluir a compra. Se houve cobrança, os créditos entram automaticamente.';
  }
}
