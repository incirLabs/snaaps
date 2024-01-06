import cx from 'classnames';
import {Button, Surface, PageContainer} from '../../components';
import {useAddToMetamask, useSnaapAddress} from '../../hooks';

import './styles.scss';

const MySnaap: React.FC = () => {
  const addresses = useSnaapAddress();
  const addToMetaMask = useAddToMetamask();

  if (!addresses) return null;

  return (
    <PageContainer className={cx('p-my-snaap')}>
      <PageContainer.Card title="🎭 MMy SnAAp">
        <div className="mb-4">
          <h4 className="mb-2">Your Signer</h4>
          <Surface.Content
            left={<span>{addresses.signer}</span>}
            right={<Button theme="text">Change</Button>}
          />
        </div>

        <div className="mb-4">
          <h4 className="mb-2">Your Contract Address</h4>
          <Surface.Content
            left={<span>{addresses.snaap}</span>}
            right={
              <Button theme="text" onClick={addToMetaMask}>
                Add to MetaMask
              </Button>
            }
          />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default MySnaap;
