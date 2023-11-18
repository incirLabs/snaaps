import {useRef} from 'react';
import {providers} from 'ethers';
import {EthooksProvider} from '@incirlabs/react-ethooks';
import {MetaMaskProvider} from './hooks';

export const DefaultProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const provider = useRef(providers.getDefaultProvider() as providers.Web3Provider);

  return <EthooksProvider provider={provider.current}>{children}</EthooksProvider>;
};

export const InpageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const provider = useRef(
    new providers.Web3Provider(window.ethereum as unknown as providers.ExternalProvider),
  );

  return (
    <EthooksProvider provider={provider.current}>
      <MetaMaskProvider>{children}</MetaMaskProvider>
    </EthooksProvider>
  );
};

export const Web3Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
  if (!window.ethereum) {
    return <DefaultProvider>{children}</DefaultProvider>;
  }

  return <InpageProvider>{children}</InpageProvider>;
};
