import {Link} from 'react-router-dom';
import {Paths} from '../../routes/Paths';
import {NetworkKeys, NetworksConfig} from '../../utils/NetworksConfig';

import {LogoSquare} from '../../assets/LogoSquare';
import {PlusIcon} from '../../assets/Icons/PlusIcon';

import './styles.scss';

export type HeaderProps = {
  networks?: NetworkKeys[];
  walletAddress?: string;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const {networks, walletAddress} = props;

  return (
    <div className="c-header">
      <h1 className="c-header_logo">
        <LogoSquare width={32} height={32} className="me-3" />
        snAAps
      </h1>

      {networks ? (
        <div className="c-header_networks">
          {walletAddress ? (
            <Link
              to={Paths.MySnaap(walletAddress).Networks}
              className="c-header_networks_add-button"
            >
              <PlusIcon width={14} height={14} />
            </Link>
          ) : null}

          {networks.map((networkKey) => {
            const network = NetworksConfig[networkKey];

            return (
              <network.logo.square.component
                width={network.logo.square.preferredHeight * 1.2}
                height={network.logo.square.preferredHeight * 1.2}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
