import cx from 'classnames';
import {Button, PageContainer, Surface} from '../../components';

import './styles.scss';

const Landing: React.FC = () => {
  return (
    <PageContainer area="center" className={cx('p-landing')}>
      <Surface className="p-landing_content">
        <span className="p-landing_title">Turn Your EOA to AA</span>

        <span className="p-landing_subtitle">
          You need to install <b>MetaMask Flask</b> to use this DAPP
        </span>

        <Button
          theme="chip"
          as="a"
          href="https://metamask.io/flask/"
          target="_blank"
          rel="noreferrer"
        >
          Install 🦊 Flask
        </Button>
      </Surface>
    </PageContainer>
  );
};

export default Landing;
