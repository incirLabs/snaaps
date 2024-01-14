import cx from 'classnames';
import {NetworkButton} from './NetworkButton/NetworkButton';
import {Button, PageContainer} from '../../components';
import {NetworksConfig} from '../../utils/NetworksConfig';

import './styles.scss';

const Networks: React.FC = () => {
  return (
    <PageContainer className={cx('p-networks')}>
      <PageContainer.Card className="p-networks_content" title="You Are Connected To CyberConnect">
        <div className="p-networks_address">
          <span>0x4C5920A65C90A1babc4C8bC66d2D3aBDD036b834</span>

          {(['linea', 'scroll'] as const).map((network) => {
            const logo = NetworksConfig[network].logo.square;

            return <logo.component width={logo.preferredHeight} height={logo.preferredHeight} />;
          })}
        </div>

        <div className="flex-1">
          <div className="p-networks_networks">
            {Object.entries(NetworksConfig).map(([key, value]) => (
              <NetworkButton
                key={key}
                left={<value.logo.square.component height={value.logo.square.preferredHeight} />}
              >
                $4.12
              </NetworkButton>
            ))}
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
