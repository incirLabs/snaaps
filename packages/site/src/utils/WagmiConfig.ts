import {createConfig, http} from 'wagmi';
import {Chain} from 'wagmi/chains';
import {injected} from 'wagmi/connectors';
import {NetworksConfig} from './NetworksConfig';

const chains = Object.values(NetworksConfig).map((network) => network.chain) as unknown as [
  Chain,
  ...Chain[],
];

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
});
