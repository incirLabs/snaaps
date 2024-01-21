import {NetworkKeys, NetworksConfig} from 'common';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import {useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt} from 'wagmi';
import {Link, useParams} from 'react-router-dom';
import {SimpleAccountFactory} from 'contracts';
import {ActivityIndicator, Button, NetworkButton, PageContainer} from '../../components';
import {useSignerAddress} from '../../hooks';
import {getContractDeployedChains} from '../../utils/Networks';
import {Paths} from '../Paths';

import {NetworksLogos} from '../../assets/NetworksLogos';

import './styles.scss';

const Networks: React.FC = () => {
  const {address} = useParams();
  const {signerAddress} = useSignerAddress(address);

  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKeys>();
  const [deployedNetworks, setDeployedNetworks] = useState<NetworkKeys[]>([]);

  const chainId = useChainId();
  const {switchChainAsync} = useSwitchChain();
  const {writeContractAsync, data: lastTxHash} = useWriteContract();
  const {status} = useWaitForTransactionReceipt({hash: lastTxHash});

  useEffect(() => {
    if (!address) return;

    (async () => {
      setLoading(true);

      const chains = await getContractDeployedChains(address);

      setDeployedNetworks(chains);
      setSelectedNetwork(undefined);
      setLoading(false);
    })();
  }, [address, status]);

  const deployContract = async () => {
    if (!selectedNetwork || !address) return;
    const selected = NetworksConfig[selectedNetwork];

    if (chainId !== selected.id) {
      await switchChainAsync({chainId: selected.id});
    }

    await writeContractAsync({
      abi: SimpleAccountFactory,
      address: selected.accountFactory,
      functionName: 'createAccount',
      args: [signerAddress, 0],
      chainId: selected.id,
    });
  };

  return (
    <PageContainer className={cx('p-networks')}>
      <PageContainer.Card className="p-networks_content" title="Select Networks to Deploy">
        <div className="p-networks_address">
          <span>{address}</span>

          {deployedNetworks.map((key) => {
            const logo = NetworksLogos[key];

            return (
              <logo.square.component
                key={key}
                width={logo.square.preferredHeight}
                height={logo.square.preferredHeight}
              />
            );
          })}
        </div>

        <div className="flex-1">
          {loading ? (
            <ActivityIndicator className="w-100 py-5" />
          ) : (
            <div className="p-networks_networks">
              {NetworkKeys.map((key) => {
                const network = NetworksConfig[key];
                const logo = NetworksLogos[key];

                return (
                  <NetworkButton
                    key={key}
                    left={<logo.square.component height={logo.square.preferredHeight} />}
                    active={selectedNetwork === key}
                    disabled={deployedNetworks.includes(key)}
                    onClick={() => setSelectedNetwork(key as NetworkKeys)}
                  >
                    {network.name}
                  </NetworkButton>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-networks_buttons">
          {selectedNetwork ? (
            <Button theme="chip" onClick={deployContract}>
              Deploy on {NetworksConfig[selectedNetwork].name}
            </Button>
          ) : (
            <Button theme="chip" disabled>
              Select a Network to Deploy
            </Button>
          )}

          <Button
            theme="chip"
            disabled={deployedNetworks.length === 0}
            as={Link}
            to={Paths.MySnaap(address ?? '').MySnaap}
          >
            Continue
          </Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Networks;
