import cx from 'classnames';
import {Button, PageContainer} from '../../components';

import {LineaLogoSquare} from '../../assets/Networks/LineaLogoSquare';
import {ScrollLogoSquare} from '../../assets/Networks/ScrollLogoSquare';
import {ArbitrumLogoSquare} from '../../assets/Networks/ArbitrumLogoSquare';
import {PolygonLogoSquare} from '../../assets/Networks/PolygonLogoSquare';
import {EthereumLogoSquare} from '../../assets/Networks/EthereumLogoSquare';
import {OptimismLogoSquare} from '../../assets/Networks/OptimismLogoSquare';

import './styles.scss';
import {NetworkButton} from './NetworkButton/NetworkButton';

const Networks: React.FC = () => {
  return (
    <PageContainer className={cx('p-networks')}>
      <PageContainer.Card className="p-networks_content" title="You Are Connected To CyberConnect">
        <div className="p-networks_address">
          <span>0x4C5920A65C90A1babc4C8bC66d2D3aBDD036b834</span>

          <LineaLogoSquare width={20} height={20} />
          <ScrollLogoSquare width={20} height={20} />
        </div>

        <div className="flex-1">
          <div className="p-networks_networks">
            <NetworkButton disabled left={<LineaLogoSquare height={20} />}>
              $4.12
            </NetworkButton>
            <NetworkButton active left={<ScrollLogoSquare height={20} />}>
              $4.12
            </NetworkButton>
            <NetworkButton active left={<ArbitrumLogoSquare height={20} />}>
              $4.12
            </NetworkButton>
            <NetworkButton left={<PolygonLogoSquare height={20} />}>$4.12</NetworkButton>
            <NetworkButton left={<EthereumLogoSquare height={20} />}>$4.12</NetworkButton>
            <NetworkButton left={<OptimismLogoSquare height={20} />}>$4.12</NetworkButton>
          </div>
        </div>

        <div className="p-networks_buttons">
          <Button theme="chip" color="dark">
            Deploy All
          </Button>

          <Button theme="chip">Deploy Selected (2)</Button>

          <Button theme="chip">Continue</Button>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Networks;
