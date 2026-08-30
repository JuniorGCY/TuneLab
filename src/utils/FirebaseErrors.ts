export function getFirebaseErrorMessage(erroCode: string): string {
    switch (erroCode) {
        case 'auth/email-already-in-use':
          return 'Este e-mail já está cadastrado. Tente fazer login.';
        case 'auth/invalid-email':
          return 'O formato do e-mail é inválido. Verifique e tente novamente.';
        case 'auth/weak-password':
          return 'A senha é muito fraca. Escolha uma senha com pelo menos 6 caracteres.';
        case 'auth/user-not-found':
          return 'Não encontramos uma conta com este e-mail.';
        case 'auth/wrong-password':
          return 'Senha incorreta. Verifique os dados informados.';
        case 'auth/network-request-failed':
          return 'Sem conexão com a internet. Verifique sua rede.';
        default:
          return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
}