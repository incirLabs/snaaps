import cx from 'classnames';
import {useConnect} from 'wagmi';
import {injected} from 'wagmi/connectors';
import {Link} from 'react-router-dom';
import {Button, Surface, PageContainer, Marquee, Row, Col} from '../../components';
import {useMetamask, useProviderState} from '../../hooks';
import {Paths} from '../Paths';

import {NetworksLogos} from '../../assets/NetworksLogos';

import './styles.scss';

const Landing: React.FC = () => {
  const [, , installSnap] = useMetamask();
  const providerState = useProviderState();
  const {connect} = useConnect();

  return (
    <PageContainer className={cx('p-landing')}>
      <PageContainer.Card className="p-landing_info container g-5">
        <Row className="g-5">
          <Col span={24} lg={9} className="d-flex f-dir-col align-center">
            <div className="p-landing_info_image">
              <iframe src="/LandingAnim.html" width="100%" height="100%" />
            </div>
          </Col>

          <Col span={24} lg={15} className="d-flex">
            <div className="p-landing_info_content">
              <h1 className="p-landing_info_content_title">
                Control Your AA Account on Metamask Snaps
              </h1>

              {!providerState.flaskInstalled ? (
                <div className="p-landing_info_content_buttons">
                  <Button
                    theme="chip"
                    color="dark"
                    as="a"
                    href="https://metamask.io/flask/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Install MetaMask🦊 Flask
                  </Button>
                </div>
              ) : null}

              {providerState.flaskInstalled && !providerState.connected ? (
                <div className="p-landing_info_content_buttons">
                  <Button
                    theme="chip"
                    color="dark"
                    onClick={() => connect({connector: injected()})}
                  >
                    Connect Your MetaMask🦊 Wallet
                  </Button>
                </div>
              ) : null}

              {providerState.connected && !providerState.snapInstalled ? (
                <div className="p-landing_info_content_buttons">
                  <Button theme="chip" color="dark" onClick={() => installSnap()}>
                    Install SnAAp 😸
                  </Button>
                </div>
              ) : null}

              {providerState.connected && providerState.snapInstalled ? (
                <div className="p-landing_info_content_buttons-group">
                  <div className="p-landing_info_content_buttons">
                    <Button
                      theme="chip"
                      color="dark"
                      className="w-100"
                      as={Link}
                      to={Paths.MySnaaps.Root}
                    >
                      Open snAAps 😸
                    </Button>
                  </div>

                  <div className="p-landing_info_content_buttons">
                    <Button theme="chip" color="dark" as={Link} to={Paths.Landing.Integrate}>
                      Integrate Your AA Wallet 🦊
                    </Button>

                    <Button theme="chip" as={Link} to={Paths.Landing.CreateNew}>
                      Get an AA Wallet
                    </Button>
                  </div>

                  <div className="p-landing_info_content_buttons">
                    <Button theme="chip" onClick={() => installSnap()}>
                      Reinstall SnAAp 😸
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
      </PageContainer.Card>

      <span className="p-landing_networks-title">Supported Networks</span>

      <Surface className="p-landing_networks">
        <Marquee duration={40_000} reversed className="p-landing_networks_content">
          {Object.entries(NetworksLogos).map(([key, logo]) => (
            <Button key={key} theme="chip" as="div">
              <logo.wide.component height={logo.wide.preferredHeight} />
            </Button>
          ))}
        </Marquee>
      </Surface>

      <div className="p-landing_features container g-0">
        <Row className="g-3">
          <Col span={24} md={12} className="d-flex">
            <Surface className="p-landing_features_card">
              <Surface>
                <h4 className="p-landing_features_title">Setup Your AA Wallet in Minutes</h4>
              </Surface>

              <Surface className="p-landing_features_content">
                <span>Control Your AA Wallet Directly On Metamask</span>
                <span>Same Address for All L2 Networks</span>
                <span>Make Any TX with Any dApp with Your AA</span>
              </Surface>
            </Surface>
          </Col>

          <Col span={24} md={12} className="d-flex">
            <Surface className="p-landing_features_card">
              <Surface>
                <h4 className="p-landing_features_title">Control Your AA Wallet</h4>
              </Surface>

              <Surface className="p-landing_features_content">
                <span>Control Your AA Wallet Directly On Metamask</span>
                <span>Only For Supported Wallets</span>
              </Surface>
            </Surface>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Landing;
