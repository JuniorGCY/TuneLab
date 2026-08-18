export const colors = {
    // Cores do app
  primary: '#FF6B00',
  tertiary: '#049EFF',
  secondary: '#E63946',

  // Neutros / Backgrounds
  background: '#F6F6F6',
  surface: '#88736A',
  
  // Textos
  textPrimary: '#121212',
  textSecondary: '#666666',
  textMuted: '#999999',

  // Status / Feedback
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#B00020',
  
  // Utilidades
  border: '#E0E0E0',
  transparent: 'transparent',

} as const

export type ColorKeys = keyof typeof colors;