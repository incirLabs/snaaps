import cx from 'classnames';
import {Button, Surface, PageContainer, Input} from '../../components';

import './styles.scss';

const Integrate: React.FC = () => {
  return (
    <PageContainer className={cx('p-integrate')}>
      <PageContainer.Card className="p-integrate_page">
        <Surface className="p-integrate_wallets">
          <Button theme="primary">snAAps</Button>
          <Button theme="primary">CyberConnect</Button>
          <Button theme="primary">Safe</Button>
          <Button theme="primary">Any ERC-4337</Button>
          <Button theme="primary">Suggest an AA</Button>
        </Surface>

        <div className="p-integrate_content">
          <h2 className="p-integrate_content_title">Enter Your Smart Contract Wallet Address</h2>

          <Input type="text" placeholder="0x0000000" />

          <Button theme="chip" color="dark" className="p-integrate_content_button">
            Integrate Your AA Wallet 🦊
          </Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Integrate;
