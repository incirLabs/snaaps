import {WagmiProvider} from 'wagmi';
import {MetaMaskProvider} from './hooks';
import {wagmiConfig} from './utils/WagmiConfig';

export const DefaultProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export const InpageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <MetaMaskProvider>{children}</MetaMaskProvider>
    </WagmiProvider>
  );
};

export const Web3Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
  if (!window.ethereum) {
    return <DefaultProvider>{children}</DefaultProvider>;
  }

  return <InpageProvider>{children}</InpageProvider>;
};
