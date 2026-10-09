import { statusCodes } from '@react-native-google-signin/google-signin';

// Extrai o código de um erro do Firebase/Google Sign-In sem precisar de "any".
export function getErrorCode(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const { code } = error as { code: unknown };
        return typeof code === 'string' ? code : '';
    }
    return '';
}

export function getFirebaseErrorMessage(erroCode: string): string {
    switch (erroCode) {
        // Login com Google
        case statusCodes.IN_PROGRESS:
          return 'O login já está em andamento.';
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return 'Atualize o Google Play Services para entrar com Google.';
        case 'auth/user-disabled':
          return 'Esta conta foi desativada. Fale com o suporte.';
        case 'auth/account-exists-with-different-credential':
          return 'Já existe uma conta com este e-mail. Fale com o suporte para recuperar o acesso.';

        // Verificação do celular
        case 'auth/invalid-phone-number':
          return 'Número de celular inválido. Confira o DDD e o número.';
        case 'auth/invalid-verification-code':
          return 'Código incorreto. Confira o SMS e tente de novo.';
        case 'auth/session-expired':
        case 'auth/code-expired':
          return 'O código expirou. Peça um novo SMS.';
        case 'auth/credential-already-in-use':
          return 'Este celular já está vinculado a outra conta.';
        case 'auth/too-many-requests':
          return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
        case 'auth/quota-exceeded':
          return 'Não conseguimos enviar o SMS agora. Tente mais tarde.';
        // O Firebase não conseguiu confirmar que o pedido veio do app oficial (Play Integrity).
        case 'auth/missing-client-identifier':
        case 'auth/app-not-authorized':
          return 'Não conseguimos verificar o app para enviar o SMS. Atualize o TuneLab pela Play Store e tente de novo.';

        case 'auth/network-request-failed':
          return 'Sem conexão com a internet. Verifique sua rede.';
        default:
          return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
}
