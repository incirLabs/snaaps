/// <reference types="vite/client" />

import type {MetaMaskInpageProvider} from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type ObjectKeys<T> = T extends Record<string | number, any>
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
