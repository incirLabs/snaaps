import cx from 'classnames';
import {Surface, SurfaceProps} from '../Surface/Surface';
import {NetworkKeys, NetworksConfig} from '../../utils/NetworksConfig';

import './styles.scss';

export type AccountCardProps = SurfaceProps & {
  text: string;
  chains: NetworkKeys[];
  right?: React.ReactNode;
};

export const AccountCard: React.FC<AccountCardProps> = (props) => {
  const {text, chains, right, className, ...restProps} = props;

  return (
    <Surface className={cx('c-account-card', className)} {...restProps}>
      <span className="c-account-card_text">{text}</span>

      <div className="c-account-card_chains">
        {chains.map((chainKey) => {
          const chain = NetworksConfig[chainKey];

          return (
            <chain.logo.square.component
              width={chain.logo.square.preferredHeight * 1.5}
              height={chain.logo.square.preferredHeight * 1.5}
            />
          );
        })}
      </div>

      {right ? <div className="c-account-card_right">{right}</div> : null}
    </Surface>
  );
};
