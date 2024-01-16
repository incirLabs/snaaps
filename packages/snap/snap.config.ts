import type {SnapConfig} from '@metamask/snaps-cli';
import {resolve} from 'path';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
    stream: true,
    crypto: true,
  },
  environment: {
    DAPP_ORIGIN_PRODUCTION: 'https://usesnaaps.com',
    DAPP_ORIGIN_DEVELOPMENT: 'http://localhost:3000',
    SNAP_ORIGIN: 'local:http://localhost:8080',
    SNAP_PIMLICO_API_KEY: '0',
  },
  stats: {
    builtIns: {
      // The following builtins can be ignored. They are used by some of the
      // dependencies, but are not required by this snap.
      ignore: ['events', 'http', 'https', 'zlib', 'util', 'url', 'string_decoder', 'punycode'],
    },
  },
};

export default config;
