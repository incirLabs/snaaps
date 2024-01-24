import {ErrorCodes} from 'common';
import {useState} from 'react';
import cx from 'classnames';
import {useConnect} from 'wagmi';
import {injected} from 'wagmi/connectors';
import {Link} from 'react-router-dom';
import {
  Accordion,
  Button,
  Surface,
  PageContainer,
  Marquee,
  Row,
  Col,
  showToast,
  ActivityIndicator,
} from '../../components';
import {useMetamask, useProviderState} from '../../hooks';
import {Paths} from '../Paths';
import {FAQContent} from './FAQContent';

import {NetworksLogos} from '../../assets/NetworksLogos';
import {LogoSquare} from '../../assets/LogoSquare';

import './styles.scss';

const Landing: React.FC = () => {
  const [, , installSnap] = useMetamask();
  const providerState = useProviderState();
  const {connect} = useConnect();

  const [emailLoading, setEmailLoading] = useState(false);

  const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailLoading) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = (e.target as any)?.email?.value;

    if (!email) {
      showToast({
        title: 'Email is required',
        message: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/email`, {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();

      if (!response.ok || !json.email) {
        let message = '';
        if (json?.code === ErrorCodes.FillAllFields)
          message = 'Please enter a valid email address.';
        if (json?.code === ErrorCodes.AlreadyExists) message = 'This email is already registered.';

        throw new Error(message);
      }

      showToast({
        title: 'Success',
        message: `You have been registered successfully with the email address: ${json.email}`,
        type: 'success',
      });
    } catch (error) {
      let message = 'Something went wrong. Please try again later.';
      if (error instanceof Error && error.message) message = error.message;

      showToast({
        title: 'Error',
        message,
        type: 'error',
      });
    } finally {
      setEmailLoading(false);
      (e.target as HTMLFormElement).reset();
    }
  };

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
            {process.env.NODE_ENV === 'development' ? (
              <div className="p-landing_info_content">
                <h1 className="p-landing_info_content_title">
                  snAAps Allows You to Use Your ERC4337 Accounts Directly On MetaMask
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
                      Install SnAAp
                    </Button>
                  </div>
                ) : null}

                {providerState.connected && providerState.snapInstalled ? (
                  <div className="p-landing_info_content_buttons w-50">
                    <Button
                      theme="chip"
                      color="dark"
                      className="p-landing_info_open-snaaps-button"
                      as={Link}
                      to={Paths.MySnaaps.Root}
                    >
                      <LogoSquare width={18} fill="#fff" /> Open snAAps
                    </Button>
                  </div>
                ) : null}

                {process.env.NODE_ENV === 'development' ? (
                  <div className="p-landing_info_content_buttons">
                    <Button theme="chip" onClick={() => installSnap()}>
                      Reinstall SnAAp
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-landing_info_content">
                <h1 className="p-landing_info_content_title">
                  snAAps Allows You to Use Your ERC4337 Accounts Directly On MetaMask
                </h1>

                <div className="p-landing_info_content_buttons w-100">
                  <form method="GET" onSubmit={onEmailSubmit}>
                    <div className="p-landing_info_content_register">
                      <input name="email" type="email" placeholder="Drop Your Email Here to" />

                      <Button
                        type="submit"
                        theme="chip"
                        color="dark"
                        className="d-flex align-center gap-2"
                        disabled={emailLoading}
                      >
                        {emailLoading ? <ActivityIndicator size="small" color="white" /> : null}
                        Register For Alpha
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </PageContainer.Card>

      <span className="p-landing_section-title">Supported Networks</span>

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
                <h4 className="p-landing_features_title">Get a New ERC4337 Wallet in Minutes</h4>
              </Surface>

              <Surface className="p-landing_features_content">
                <span>
                  If you don't already have an ERC4337 wallet, quickly get yourself a wallet address
                  supported on Ethereum and L2 networks.
                </span>
                <span>
                  With this wallet, you can perform all transactions on MetaMask in the way you're
                  accustomed to.
                </span>
              </Surface>
            </Surface>
          </Col>

          <Col span={24} md={12} className="d-flex">
            <Surface className="p-landing_features_card">
              <Surface>
                <h4 className="p-landing_features_title">
                  Control Your Existing AA Wallet On Your Metamask
                </h4>
              </Surface>

              <Surface className="p-landing_features_content">
                <span>Start using your current ERC4337 account on your MetaMask.</span>
                <span>Currently, Only For Supported Wallets*</span>
              </Surface>
            </Surface>
          </Col>
        </Row>
      </div>

      <span className="p-landing_section-title">FAQ</span>

      <Accordion as={Surface} className="p-landing_faq">
        {FAQContent.map(([handle, content]) => (
          <Accordion.Item
            as={Surface}
            className="p-landing_faq_item"
            activeClassName="p-landing_faq_item--active"
          >
            <Accordion.Handle className="p-landing_faq_item_handle">
              <span>{handle}</span>

              <Accordion.Content>
                <div className="p-landing_faq_item_content">{content}</div>
              </Accordion.Content>
            </Accordion.Handle>
          </Accordion.Item>
        ))}
      </Accordion>
    </PageContainer>
  );
};

export default Landing;
