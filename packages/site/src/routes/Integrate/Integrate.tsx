import {NetworksConfig} from 'common';
import {useState} from 'react';
import cx from 'classnames';
import {isAddress, isHash} from 'viem';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {useNavigate} from 'react-router-dom';
import {Button, PageContainer, Input, NetworkButton, ActivityIndicator} from '../../components';
import {useDeployedNetworks} from '../../hooks';
import {addHexPrefix, stripHexPrefix} from '../../utils/Networks';
import {SNAP_ORIGIN} from '../../utils/Env';
import {Paths} from '../Paths';

import {NetworksLogos} from '../../assets/NetworksLogos';

import './styles.scss';

const Integrate: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'address' | 'privateKey'>('address');

  const [address, setAddress] = useState<string>('');
  const [addressError, setAddressError] = useState<string | undefined>(undefined);

  const [privateKey, setPrivateKey] = useState<string>('');
  const [privateKeyError, setPrivateKeyError] = useState<string | undefined>(undefined);

  const {deployedNetworks, loading: networksLoading} = useDeployedNetworks(address);

  const loading = networksLoading;

  const onIntegrateClick = async () => {
    if (step === 'address') {
      if (!isAddress(address)) {
        setAddressError('Invalid address');
        return;
      }

      setAddressError(undefined);
      setStep('privateKey');
    }

    if (step === 'privateKey') {
      // Private keys also has 32 bytes, so it's a valid `hash`
      if (!isHash(addHexPrefix(privateKey))) {
        setPrivateKeyError('Invalid private key');
        return;
      }

      setPrivateKeyError(undefined);

      const client = new KeyringSnapRpcClient(SNAP_ORIGIN, window.ethereum);

      const account = await client.createAccount({
        address: addHexPrefix(address),
        privateKey: stripHexPrefix(privateKey),
      });

      navigate(Paths.MySnaap(account.address).Networks);
    }
  };

  return (
    <PageContainer className={cx('p-integrate')}>
      <PageContainer.Card className="p-integrate_page">
        <div className="p-integrate_content">
          <h2 className="p-integrate_content_title">Integrate Your AA Smart Contract Wallet</h2>

          <Input
            type="text"
            label="Enter Your Smart Contract Wallet Address"
            placeholder="0x0000000"
            error={addressError}
            value={address}
            readOnly={step !== 'address'}
            onChange={(e) => setAddress(e.target.value)}
          />

          {step !== 'address' && !networksLoading && deployedNetworks.length === 0 ? (
            <div>
              <h3>No networks found</h3>
              <p>
                Please make sure you have deployed your AA Smart Contract Wallet to at least one
                network we currently support.
              </p>
            </div>
          ) : null}

          {step !== 'address' && deployedNetworks.length > 0 ? (
            <>
              <div className="p-integrate_networks">
                {deployedNetworks.map((key) => {
                  const network = NetworksConfig[key];
                  const logo = NetworksLogos[key];

                  return (
                    <NetworkButton
                      key={key}
                      left={<logo.square.component height={logo.square.preferredHeight} />}
                      active={deployedNetworks.includes(key)}
                      className="p-integrate_networks_network"
                    >
                      {network.name}
                    </NetworkButton>
                  );
                })}
              </div>

              <Input
                type="password"
                label="Enter Your Signer Private Key"
                placeholder="0x0000000"
                error={privateKeyError}
                value={privateKey}
                readOnly={step !== 'privateKey'}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </>
          ) : null}

          <Button
            theme="chip"
            color="dark"
            className="p-integrate_content_button"
            onClick={loading ? undefined : onIntegrateClick}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
            Integrate Your AA Wallet 🦊
          </Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Integrate;
