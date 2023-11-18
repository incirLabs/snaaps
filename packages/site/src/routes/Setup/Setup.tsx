import {useState} from 'react';
import cx from 'classnames';
import {Wallet} from 'ethers';
import {useAccount, useContractWrite} from '@incirlabs/react-ethooks';
import {Button, Surface, PageContainer} from '../../components';
import {useSimpleAccountFactory} from '../../hooks/Contracts';

import './styles.scss';

const Setup: React.FC = () => {
  const {address} = useAccount();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const AccountFactory = useSimpleAccountFactory();
  const createAccount = useContractWrite(AccountFactory, 'createAccount');
  const getAccountAddress = useContractWrite(AccountFactory, 'getAddress');

  const onCreateSignerClick = async () => {
    setWallet(Wallet.createRandom());
  };

  const onDeployClick = async () => {
    if (!wallet) return;

    const tx = await createAccount([wallet.address, 0]);
    if (!tx.status) {
      console.log('tx error', tx.error);
      return;
    }

    const receipt = await tx.data.wait();
    console.log('receipt', receipt);

    const aaAddress = getAccountAddress([wallet.address, 0]);

    console.log('aaAddress', aaAddress);
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
      </Surface>
    </PageContainer>
  );
};

export default Setup;
