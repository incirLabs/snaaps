import cx from 'classnames';
import {Button, Surface, PageContainer, Marquee} from '../../components';

import {LineaLogo} from '../../assets/Networks/LineaLogo';
import {ScrollLogo} from '../../assets/Networks/ScrollLogo';
import {ArbitrumLogo} from '../../assets/Networks/ArbitrumLogo';
import {OptimismLogo} from '../../assets/Networks/OptimismLogo';
import {PolygonLogo} from '../../assets/Networks/PolygonLogo';
import {EthereumLogo} from '../../assets/Networks/EthereumLogo';

import './styles.scss';

const Landing: React.FC = () => {
  return (
    <PageContainer area="center" className={cx('p-landing')}>
      <Surface className="p-landing_info">
        <div className="p-landing_info_image"></div>

        <div className="p-landing_info_content">
          <h1 className="p-landing_info_content_title">Control Your AA Acount on Metamask Snaps</h1>

          <div className="p-landing_info_content_buttons">
            <Button theme="chip" color="dark">
              Integrate Your AA Wallet 🦊
            </Button>
            <Button theme="chip">Get an AA Wallet</Button>
          </div>
        </div>
      </Surface>

      <span className="p-landing_networks-title">Supported Networks</span>

      <Surface className="p-landing_networks">
        <Marquee duration={15_000} className="p-landing_networks_content">
          <Button theme="chip" as="div">
            <LineaLogo height={18} />
          </Button>

          <Button theme="chip" as="div">
            <ScrollLogo height={20} />
          </Button>

          <Button theme="chip" as="div">
            <ArbitrumLogo height={24} />
          </Button>

          <Button theme="chip" as="div">
            <OptimismLogo height={14} />
          </Button>

          <Button theme="chip" as="div">
            <PolygonLogo height={20} />
          </Button>

          <Button theme="chip" as="div">
            <EthereumLogo height={22} />
          </Button>
        </Marquee>
      </Surface>
    </PageContainer>
  );
};

export default Landing;
