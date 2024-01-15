import {Env} from 'common';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import {Hex} from 'viem';
import {useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt} from 'wagmi';
import {Link, useParams} from 'react-router-dom';
import {SimpleAccountFactory} from 'contracts';
import {NetworkButton} from './NetworkButton/NetworkButton';
import {ActivityIndicator, Button, PageContainer} from '../../components';
import {useSignerAddress} from '../../hooks';
import {getContractDeployedChains} from '../../utils/Networks';
import {NetworkKeys, NetworksConfig} from '../../utils/NetworksConfig';
import {Paths} from '../Paths';

import './styles.scss';

const Networks: React.FC = () => {
  const {address} = useParams();
  const signerAddress = useSignerAddress(address);

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

    if (chainId !== selected.chain.id) {
      await switchChainAsync({chainId: selected.chain.id});
    }

    await writeContractAsync({
      abi: SimpleAccountFactory,
      address: Env.ACCOUNT_FACTORY_ADDRESS as Hex,
      functionName: 'createAccount',
      args: [signerAddress, 0],
      chainId: selected.chain.id,
    });
  };

  return (
    <PageContainer className={cx('p-networks')}>
      <PageContainer.Card className="p-networks_content" title="Select Networks to Deploy">
        <div className="p-networks_address">
          <span>{address}</span>

          {deployedNetworks.map((key) => {
            const network = NetworksConfig[key];

            return (
              <network.logo.square.component
                key={key}
                width={network.logo.square.preferredHeight}
                height={network.logo.square.preferredHeight}
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

                return (
                  <NetworkButton
                    key={key}
                    left={
                      <network.logo.square.component height={network.logo.square.preferredHeight} />
                    }
                    active={selectedNetwork === key}
                    disabled={deployedNetworks.includes(key)}
                    onClick={() => setSelectedNetwork(key as NetworkKeys)}
                  >
                    $4.12
                  </NetworkButton>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-networks_buttons">
          {deployedNetworks.length === NetworkKeys.length ? (
            <Button theme="chip" color="dark" disabled>
              All Chains Deployed
            </Button>
          ) : (
            <Button
              theme="chip"
              color="dark"
              disabled
              onClick={() => {
                // TODO: discuss how to handle this
              }}
            >
              Deploy All
            </Button>
          )}

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
