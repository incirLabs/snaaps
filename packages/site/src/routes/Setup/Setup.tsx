import {Env} from 'common';
import cx from 'classnames';
import {Wallet} from 'ethers';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {useContractWrite} from '@incirlabs/react-ethooks';
import {Button, Surface, PageContainer} from '../../components';
import {useSimpleAccountFactory} from '../../hooks/Contracts';

import './styles.scss';

const Setup: React.FC = () => {
  const AccountFactory = useSimpleAccountFactory();
  const createAccount = useContractWrite(AccountFactory, 'createAccount');
  const getAccountAddress = useContractWrite(AccountFactory, 'getAddress');

  const onDeployClick = async () => {
    const wallet = Wallet.createRandom();

    const tx = await createAccount([wallet.address, 0]);
    if (!tx.status) {
      console.error('tx error', tx.error);
      return;
    }

    const receipt = await tx.data.wait();

    const aaAddressRes = await getAccountAddress([wallet.address, 0]);

    if (!aaAddressRes.status) {
      console.error("Couldn't get AA address", aaAddressRes.error);
      return;
    }

    const aaAddress = aaAddressRes.data;

    try {
      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const account = await client.createAccount({
        type: 'eip155:eip4337',
        address: aaAddress,
        privateKey: wallet.privateKey.replace('0x', ''),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContainer area="center" className={cx('p-setup')}>
      <Surface className="p-setup_content">
        <Button theme="chip" onClick={onDeployClick}>
          + Create and deploy a new AA signer
        </Button>
      </Surface>
    </PageContainer>
  );
};

export default Setup;
