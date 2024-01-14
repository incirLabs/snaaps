import {useAccount} from '@incirlabs/react-ethooks';
import {useMetamask} from './MetamaskContext';

export const useProviderState = () => {
  const [metamaskState] = useMetamask();
  const address = useAccount();

  const flaskInstalled = metamaskState.snapsDetected && metamaskState.isFlask;
  const connected = flaskInstalled && address;
  const snapInstalled = connected && metamaskState.installedSnap;

  return {
    flaskInstalled,
    connected,
    snapInstalled,
  };
};
