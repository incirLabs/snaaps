import {NetworksConfig} from 'common';
import {createConfig, http} from 'wagmi';
import {injected} from 'wagmi/connectors';
import {Chain} from 'viem/chains';

const chains = Object.values(NetworksConfig).map((network) => network.viem) as unknown as [
  Chain,
  ...Chain[],
];

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
});
