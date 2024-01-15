import cx from 'classnames';
import {useParams} from 'react-router-dom';
import {Button, Surface, PageContainer, Bubble, ActivityIndicator} from '../../components';
import {useSignerAddress} from '../../hooks';

import './styles.scss';

const MySnaap: React.FC = () => {
  const {address} = useParams();

  const {signerAddress, loading: signerLoading} = useSignerAddress(address);

  return (
    <PageContainer className={cx('p-my-snaap')}>
      <PageContainer.Card title="My SnAAp">
        <div className="mb-4">
          <h4 className="mb-2">Your Contract Address</h4>
          <Surface.Content left={<span>{address}</span>} right={<></>} />
        </div>

        <div className="mb-4">
          <h4 className="mb-2">Your Signer</h4>
          <Surface.Content
            left={signerLoading ? <ActivityIndicator size="small" /> : <span>{signerAddress}</span>}
            right={
              <Bubble content="Coming Soon!">
                <Button theme="text">Change</Button>
              </Bubble>
            }
          />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
