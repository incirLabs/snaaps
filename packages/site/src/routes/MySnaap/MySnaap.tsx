import cx from 'classnames';
import {Button, Surface, PageContainer} from '../../components';

import './styles.scss';

const MySnaap: React.FC = () => {
  return (
    <PageContainer area="center" className={cx('p-my-snaap')}>
      <PageContainer.Card title="🎭 MMy SnAAp">
        <div className="mb-4">
          <h4 className="mb-2">Your Signer</h4>
          <Surface.Content
            left={<span>0xAddress</span>}
            right={<Button theme="text">&nbsp;</Button>}
          />
        </div>

        <div className="mb-4">
          <h4 className="mb-2">Your Contract Address</h4>
          <Surface.Content
            left={<span>0xAddress</span>}
            right={<Button theme="text">Add to MetaMask</Button>}
          />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
