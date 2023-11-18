import {useState} from 'react';
import cx from 'classnames';
import {Wallet} from 'ethers';
import {Button, Surface, PageContainer} from '../../components';

import './styles.scss';

const Setup: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const onCreateSignerClick = async () => {
    setWallet(Wallet.createRandom());
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

            <Button theme="chip">Continue →</Button>
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
