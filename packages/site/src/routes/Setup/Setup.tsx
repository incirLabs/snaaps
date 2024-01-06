import cx from 'classnames';
import {Button, Surface, PageContainer, Input} from '../../components';

import './styles.scss';

const Setup: React.FC = () => {
  return (
    <PageContainer className={cx('p-setup')}>
      <Surface className="p-setup_page">
        <Surface className="p-setup_wallets">
          <Button theme="primary">snAAps</Button>
          <Button theme="primary">CyberConnect</Button>
          <Button theme="primary">Safe</Button>
          <Button theme="primary">Any ERC-4337</Button>
          <Button theme="primary">Suggest an AA</Button>
        </Surface>

        <div className="p-setup_content">
          <h2 className="p-setup_content_title">Enter Your Smart Contract Wallet Address</h2>

          <Input type="text" placeholder="0x0000000" />

          <Button theme="chip" color="dark" className="p-setup_content_button">
            Integrate Your AA Wallet 🦊
          </Button>
        </div>
      </Surface>
    </PageContainer>
  );
};

export default Setup;
