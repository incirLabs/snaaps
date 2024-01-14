import {useState} from 'react';
import cx from 'classnames';
import {useParams} from 'react-router-dom';
import {NetworkButton} from './NetworkButton/NetworkButton';
import {Button, PageContainer} from '../../components';
import {NetworkKeys, NetworksConfig} from '../../utils/NetworksConfig';

import './styles.scss';

const Networks: React.FC = () => {
  const {address} = useParams();

  const [selectedNetworks, setSelectedNetworks] = useState<NetworkKeys[]>([]);
  const [deployedNetworks, setDeployedNetworks] = useState<NetworkKeys[]>(['linea', 'scroll']);

  const toggleNetwork = (network: NetworkKeys) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter((n) => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
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
          <div className="p-networks_networks">
            {NetworkKeys.map((key) => {
              const network = NetworksConfig[key];

              return (
                <NetworkButton
                  key={key}
                  left={
                    <network.logo.square.component height={network.logo.square.preferredHeight} />
                  }
                  active={selectedNetworks.includes(key)}
                  disabled={deployedNetworks.includes(key)}
                  onClick={() => toggleNetwork(key as NetworkKeys)}
                >
                  $4.12
                </NetworkButton>
              );
            })}
          </div>
        </div>

        <div className="p-networks_buttons">
          {deployedNetworks.length === NetworkKeys.length ? (
            <Button theme="chip" color="dark" disabled>
              All Chains Deployed
            </Button>
          ) : (
            <Button theme="chip" color="dark">
              Deploy All
            </Button>
          )}

          {selectedNetworks.length > 0 ? (
            <Button theme="chip">Deploy Selected ({selectedNetworks.length})</Button>
          ) : (
            <Button theme="chip" disabled>
              Select Networks To Deploy
            </Button>
          )}

          <Button theme="chip">Continue</Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Networks;
