import {Request} from 'express';

export const GetExpressFullUrl = (req: Request): string => {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};

export const SafeExecute = <T>(fn: () => T, error: string): T => {
  try {
    return fn();
  } catch (e) {
    throw new Error(error);
  }
};
