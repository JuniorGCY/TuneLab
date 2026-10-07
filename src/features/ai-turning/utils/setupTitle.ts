export const DEFAULT_SETUP_TITLE = 'Setup sugerido pela Mia';

// O título vem da IA e passa pelo servidor, mas setups salvos antes do campo existir não o
// têm. Também cobre a ordem de deploy: app novo com API antiga continua funcionando.
export const resolveSetupTitle = (title: string | undefined): string => {
  const trimmed = title?.trim();
  return trimmed ? trimmed : DEFAULT_SETUP_TITLE;
};
