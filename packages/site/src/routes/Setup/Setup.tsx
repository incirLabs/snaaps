import {Env} from 'common';
import {useState} from 'react';
import cx from 'classnames';
import {Wallet, utils} from 'ethers';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {useAccount, useContractWrite, useSigner} from '@incirlabs/react-ethooks';
import {Button, Surface, PageContainer} from '../../components';
import {useSimpleAccountFactory} from '../../hooks/Contracts';

import './styles.scss';

const Setup: React.FC = () => {
  const {address} = useAccount();
  const {signer} = useSigner();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const AccountFactory = useSimpleAccountFactory();
  const createAccount = useContractWrite(AccountFactory, 'createAccount');
  const getAccountAddress = useContractWrite(AccountFactory, 'getAddress');

  const onCreateSignerClick = async () => {
    setWallet(Wallet.createRandom());
  };

  const onDeployClick = async () => {
    if (!wallet) return;

    console.log(Env.SNAP_ORIGIN);

    const tx = await createAccount([wallet.address, 0]);
    if (!tx.status) {
      console.log('tx error', tx.error);
      return;
    }

    const receipt = await tx.data.wait();
    console.log('receipt', receipt);

    const aaAddress = await getAccountAddress([wallet.address, 0]);

    if (!aaAddress.status) {
      console.error("Couldn't get AA address", aaAddress.error);
      return;
    }

    console.log('aaAddress', aaAddress.data);
    console.log('priv key', wallet.privateKey);

    try {
      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const account = await client.createAccount({
        type: 'eip155:eip4337',
        address: aaAddress.data,
        privateKey: wallet.privateKey,
      });

      console.log(account);
    } catch (error) {
      console.error(error);
    }
  };

  const onSendTransactionClick = async () => {
    if (!signer) return;

    signer.sendTransaction({
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      value: utils.parseEther('1'),
    });
  };

  return (
    <PageContainer area="center" className={cx('p-setup')}>
      <Surface className="p-setup_content">
        {wallet ? (
          <>
            <div className="mb-4">
              <h4 className="mb-2">Your Mnemonic</h4>
              <Surface.Content
                left={<span>{wallet?.mnemonic.phrase}</span>}
                right={<Button theme="text">Copy</Button>}
              />
            </div>

            <Button theme="chip" onClick={onDeployClick}>
              Deploy AA Wallet →
            </Button>
          </>
        ) : (
          <Button theme="chip" onClick={onCreateSignerClick}>
            + Create a new AA signer
          </Button>
        )}

        <Button theme="chip" onClick={onSendTransactionClick}>
          Send transaction
        </Button>
      </Surface>
    </PageContainer>
  );
};

export default Setup;
