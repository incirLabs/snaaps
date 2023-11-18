export const getEnv = (key: string): string | undefined => {
  try {
    return (import.meta as any).env[key] ?? process.env[key];
  } catch (_1) {
    try {
      return process.env[key];
    } catch (_2) {
      return undefined;
    }
  }
};

export const env = (key: string) => getEnv(`SNAAPS_${key}`);
export const viteEnv = (key: string) => getEnv(`VITE_${key}`);

export const SNAP_ORIGIN = viteEnv('SNAP_ORIGIN') || 'local:http://localhost:8080';
export const ACCOUNT_FACTORY_ADDRESS = viteEnv('ACCOUNT_FACTORY_ADDRESS');
