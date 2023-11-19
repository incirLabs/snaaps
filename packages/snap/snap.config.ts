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
    DAPP_ORIGIN_PRODUCTION: 'http://localhost:3000',
    DAPP_ORIGIN_DEVELOPMENT: 'http://localhost:3000',
    SNAP_ORIGIN: 'local:http://localhost:8080',
    SNAP_PIMLICO_API_KEY: '0',
    SNAP_ENTRYPOINT_ADDRESS: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
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
