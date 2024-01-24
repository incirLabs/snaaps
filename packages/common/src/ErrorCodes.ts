const ErrorCodesArray = ['UnknownError', 'FillAllFields', 'AlreadyExists', 'NotFound'] as const;

export type ErrorCodesKeys = (typeof ErrorCodesArray)[number];

type ErrorCodesMap<T extends ErrorCodesKeys = ErrorCodesKeys> = {
  [K in T]: K;
};

export const ErrorCodes = Object.fromEntries(
  ErrorCodesArray.map((code) => [code, code]),
) as unknown as ErrorCodesMap;

export type ErrorCodes = ErrorCodesKeys;
