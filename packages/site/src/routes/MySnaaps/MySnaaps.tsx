import {Env} from 'common';
import {useState} from 'react';
import cx from 'classnames';
import {Link} from 'react-router-dom';
import {KeyringAccount, KeyringSnapRpcClient} from '@metamask/keyring-api';
import {AccountCard, ActivityIndicator, Button, PageContainer} from '../../components';
import {useMount} from '../../hooks';
import {Paths} from '../Paths';

import './styles.scss';

const MySnaaps: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<KeyringAccount[]>([]);

  useMount(() => {
    (async () => {
      if (loading) return;
      setLoading(true);

      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const wallets = await client.listAccounts();

      setAccounts(wallets);
      setLoading(false);
    })();
  });

  return (
    <PageContainer className={cx('p-my-snaaps')}>
      <PageContainer.Card className="p-my-snaaps_content" title="Select an Account">
        <div className="p-my-snaaps_wallets">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              text={account.address}
              walletAddress={account.address}
              right={
                <Button theme="chip" as={Link} to={Paths.MySnaap(account.address).Networks}>
                  Configure
                </Button>
              }
            />
          ))}
        </div>

        {loading ? <ActivityIndicator size="normal" className="w-100" /> : null}
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaaps;
