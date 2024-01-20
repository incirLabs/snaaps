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
      <PageContainer.Card className="p-my-snaaps_content" title="Select an Account">
        {Object.values(snapAccounts).length > 0 || loading ? (
          <div className="p-my-snaaps_wallets">
            {Object.values(snapAccounts).map((account) => (
              <AccountCard
                key={account.id}
                text={account.address}
                walletAddress={account.address}
                right={
                  <Button theme="chip" as={Link} to={Paths.MySnaap(account.address).MySnaap}>
                    Configure
                  </Button>
                }
              />
            ))}
          </div>
        ) : (
          <div className="d-flex f-dir-col align-center">
            <h3>You don't have any wallets</h3>
            <Button theme="chip" color="dark" as={Link} to={Paths.Landing.CreateNew}>
              Get an AA Wallet
            </Button>
          </div>
        )}

        {loading ? <ActivityIndicator size="normal" className="w-100" /> : null}
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaaps;
