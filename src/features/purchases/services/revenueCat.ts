// Único arquivo do app que fala com o SDK do RevenueCat.
//
// O usuário no RevenueCat é sempre o UID do Firebase: é por ele que o webhook da API sabe de
// quem é a compra. Nunca usamos ID anônimo (sem logOut), então toda compra chega identificada.

import Purchases, { type PurchasesPackage } from 'react-native-purchases';

// Chave pública da SDK (não é segredo). Dev build: chave da Test Store. Loja: chave "goog_".
// Release com a chave da Test Store trava o app, então ela só pode ir no perfil de desenvolvimento do EAS.
const CHAVE_DA_SDK = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

export class ComprasIndisponiveisError extends Error {
  constructor(message = 'Compras indisponíveis nesta versão do app.') {
    super(message);
    this.name = 'ComprasIndisponiveisError';
  }
}

let configurado = false;

// Configura o SDK na primeira chamada e troca de conta nas seguintes, se for outro usuário.
export async function identificarUsuario(uid: string): Promise<void> {
  if (!CHAVE_DA_SDK) throw new ComprasIndisponiveisError();

  if (!configurado) {
    Purchases.configure({ apiKey: CHAVE_DA_SDK, appUserID: uid });
    configurado = true;
    return;
  }
  if ((await Purchases.getAppUserID()) !== uid) {
    await Purchases.logIn(uid);
  }
}

// Pacotes da oferta marcada como "Current" no painel (hoje, a "default").
export async function buscarPacotesDaLoja(): Promise<PurchasesPackage[]> {
  const ofertas = await Purchases.getOfferings();
  return ofertas.current?.availablePackages ?? [];
}

// Confere o usuário antes de abrir a loja: comprar com outra conta identificada creditaria
// a pessoa errada.
export async function comprarPacote(pacote: PurchasesPackage, uid: string): Promise<void> {
  if ((await Purchases.getAppUserID()) !== uid) {
    throw new ComprasIndisponiveisError('Sua sessão mudou. Feche e abra esta tela de novo.');
  }
  await Purchases.purchasePackage(pacote);
}
