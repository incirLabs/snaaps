export const getEnv = (key: string) => {
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

export const SNAP_ORIGIN = env('SNAP_ORIGIN') ?? 'local:http://localhost:8080';
