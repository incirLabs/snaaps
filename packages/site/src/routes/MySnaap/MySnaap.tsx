import cx from 'classnames';
import {useParams} from 'react-router-dom';
import {Button, Surface, PageContainer} from '../../components';
import {useSignerAddress} from '../../hooks';

import './styles.scss';

const MySnaap: React.FC = () => {
  const {address} = useParams();

  const signerAddress = useSignerAddress(address);

  return (
    <PageContainer className={cx('p-my-snaap')}>
      <PageContainer.Card title="My SnAAp">
        <div className="mb-4">
          <h4 className="mb-2">Your Contract Address</h4>
          <Surface.Content
            left={<span>{address}</span>}
            right={<Button theme="text">Add to MetaMask</Button>}
          />
        </div>

        <div className="mb-4">
          <h4 className="mb-2">Your Signer</h4>
          <Surface.Content
            left={<span>{signerAddress}</span>}
            right={<Button theme="text">Change</Button>}
          />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
