import cx from 'classnames';
import {Link, useParams} from 'react-router-dom';
import {Button, Surface, PageContainer, Bubble, ActivityIndicator} from '../../components';
import {useSignerAddress} from '../../hooks';
import {Paths} from '../Paths';

import './styles.scss';

const MySnaap: React.FC = () => {
  const {address} = useParams();

  const {signerAddress, loading: signerLoading} = useSignerAddress(address);

  return (
    <PageContainer className={cx('p-my-snaap')}>
      <PageContainer.Card title="My SnAAp" className="d-flex f-dir-col">
        <div className="p-my-snaap_content">
          <div className="mb-4">
            <h4 className="mb-2">Your Contract Address</h4>
            <Surface.Content left={<span>{address}</span>} right={<></>} />
          </div>

          <div className="mb-4">
            <h4 className="mb-2">Your Signer</h4>
            <Surface.Content
              left={
                signerLoading ? <ActivityIndicator size="small" /> : <span>{signerAddress}</span>
              }
              right={
                <Bubble content="Coming Soon!">
                  <Button theme="rounded">Change</Button>
                </Bubble>
              }
            />
          </div>
        </div>

        <div className="d-flex">
          <Button theme="chip" color="dark" as={Link} to={Paths.MySnaaps.MySnaaps}>
            Go to your Accounts
          </Button>

          <Button theme="chip" color="dark" as={Link} to={Paths.MySnaap(address ?? '').PastTxs}>
            Past Transactions
          </Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
