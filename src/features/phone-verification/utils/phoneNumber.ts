// Celular brasileiro: DDD (2 dígitos, sem zero) + 9 + 8 dígitos. Só celular recebe SMS, e por
// enquanto o envio de SMS fica limitado ao Brasil no Firebase (política de regiões).
const CELULAR_BR = /^[1-9][1-9]9\d{8}$/;

const apenasDigitos = (texto: string) => texto.replace(/\D/g, '');

// Converte o que a pessoa digitou ("(11) 98765-4321", "11987654321", "+55 11 9...") para o
// formato E.164 que o Firebase exige ("+5511987654321"). null = não é um celular válido.
export function toBrazilE164(texto: string): string | null {
  let digitos = apenasDigitos(texto);
  if (digitos.length === 13 && digitos.startsWith('55')) {
    digitos = digitos.slice(2);
  }
  return CELULAR_BR.test(digitos) ? `+55${digitos}` : null;
}

// Máscara enquanto digita: "(11) 98765-4321". Aceita no máximo os 11 dígitos nacionais.
export function formatBrazilPhone(texto: string): string {
  const digitos = apenasDigitos(texto).slice(0, 11);
  if (digitos.length <= 2) return digitos.length ? `(${digitos}` : '';
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

// Mostra o número mascarado na tela de código: "+55 (11) 9••••-4321".
export function maskE164ForDisplay(e164: string): string {
  const nacional = e164.replace(/^\+55/, '');
  if (nacional.length !== 11) return e164;
  return `+55 (${nacional.slice(0, 2)}) ${nacional[2]}••••-${nacional.slice(7)}`;
}
