import cx from 'classnames';
import {Button, Surface, PageContainer} from '../../components';

import './styles.scss';

const MySnaap: React.FC = () => {
  return (
    <PageContainer className={cx('p-my-snaap')}>
      <PageContainer.Card title="🎭 MMy SnAAp">
        <div className="mb-4">
          <h4 className="mb-2">Your Signer</h4>
          <Surface.Content
            left={<span>0x4C5920A65C90A1babc4C8bC66d2D3aBDD036b834</span>}
            right={<Button theme="text">Change</Button>}
          />
        </div>

        <div className="mb-4">
          <h4 className="mb-2">Your Contract Address</h4>
          <Surface.Content
            left={<span>0x4C5920A65C90A1babc4C8bC66d2D3aBDD036b834</span>}
            right={<Button theme="text">Add to MetaMask</Button>}
          />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
