import cx from 'classnames';
import {Link} from 'react-router-dom';
import {AccountCard, ActivityIndicator, Button, PageContainer} from '../../components';
import {useMount, useSnapAccounts} from '../../hooks';
import {Paths} from '../Paths';

import './styles.scss';

const MySnaaps: React.FC = () => {
  const [snapAccounts, reloadSnapAccounts, loading] = useSnapAccounts();

  useMount(() => {
    reloadSnapAccounts();
  });

  return (
    <PageContainer className={cx('p-my-snaaps')}>
      <PageContainer.Card className="p-my-snaaps_content" title="Your Accounts">
        {Object.values(snapAccounts).length > 0 || loading ? (
          <div className="p-my-snaaps_wallets">
            {Object.values(snapAccounts).map((account) => (
              <AccountCard
                key={account.id}
                text={account.address}
                walletAddress={account.address}
                right={
                  <Button
                    theme="rounded"
                    className="d-block w-100"
                    as={Link}
                    to={Paths.MySnaap(account.address).MySnaap}
                  >
                    Configure
                  </Button>
                }
              />
            ))}
          </div>
        ) : (
          <div className="p-my-snaaps_no-accounts">
            <div className="p-my-snaaps_no-accounts_content">
              <h3>No wallet is configured.</h3>
              <h3>Configure your accounts to unlock features. 🚀</h3>
            </div>
          </div>
        )}

        {loading ? <ActivityIndicator size="normal" className="flex-1 w-100" /> : null}

        <div className="p-my-snaaps_buttons">
          <Button theme="chip" color="dark" as={Link} to={Paths.Landing.CreateNew}>
            Get a new AA Wallet 🦊
          </Button>

          <Button theme="chip" as={Link} to={Paths.Landing.Integrate}>
            Integrate existing AA Wallet
          </Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaaps;
