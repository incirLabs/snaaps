import cx from 'classnames';
import {useAccount, useConnect} from '@incirlabs/react-ethooks';
import {Button, Surface, PageContainer} from '../../components';
import {useMetamask} from '../../hooks';

import './styles.scss';

const Landing: React.FC = () => {
  const [metamaskState, , installSnap] = useMetamask();
  const {connect} = useConnect();
  const {address} = useAccount();

  const isFlaskInstalled = metamaskState.snapsDetected && metamaskState.isFlask;
  const isConnected = isFlaskInstalled && address;
  const isSnapInstalled = isConnected && metamaskState.installedSnap;

  return (
    <PageContainer area="center" className={cx('p-landing')}>
      {!isFlaskInstalled ? (
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
      ) : null}

      {isFlaskInstalled && !isConnected ? (
        <Surface className="p-landing_content">
          <span className="p-landing_subtitle">Connect Your Wallet To Start</span>

          <span className="p-landing_title">Turn Your EOA to AA</span>

          <Button theme="chip" onClick={() => connect()}>
            Connect Your 🦊 Flask
          </Button>
        </Surface>
      ) : null}

      {isConnected && !isSnapInstalled ? (
        <Surface className="p-landing_content">
          <span className="p-landing_subtitle">Install SnAAp To Continue</span>

          <span className="p-landing_title">Turn Your EOA to AA</span>

          <Button theme="chip" onClick={() => installSnap()}>
            Install SnAAp 😸
          </Button>
        </Surface>
      ) : null}
    </PageContainer>
  );
};

export default Landing;
