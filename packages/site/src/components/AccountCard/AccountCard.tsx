import {useEffect, useState} from 'react';
import cx from 'classnames';
import {Surface, SurfaceProps} from '../Surface/Surface';
import {ActivityIndicator} from '../ActivityIndicator/ActivityIndicator';
import {getContractDeployedChains} from '../../utils/Networks';
import {NetworkKeys, NetworksConfig} from '../../utils/NetworksConfig';

import './styles.scss';

export type AccountCardProps = SurfaceProps & {
  text: string;

  /**
   * Chains to display
   */
  chains?: NetworkKeys[];

  /**
   * Wallet address that is used to determine which chains are deployed
   * Not used if chains prop is provided
   */
  walletAddress?: string;

  right?: React.ReactNode;
};

export const AccountCard: React.FC<AccountCardProps> = (props) => {
  const {text, chains: chainsProp, walletAddress, right, className, ...restProps} = props;

  const [loading, setLoading] = useState(false);
  const [chainsState, setChainsState] = useState<NetworkKeys[]>([]);

  useEffect(() => {
    if (chainsProp || !walletAddress) return;

    (async () => {
      setLoading(true);

      const chains = await getContractDeployedChains(walletAddress);

      setChainsState(chains);
      setLoading(false);
    })();
  }, [walletAddress, chainsProp]);

  return (
    <Surface className={cx('c-account-card', className)} {...restProps}>
      <span className="c-account-card_text">{text}</span>

      <div className="c-account-card_chains">
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          (chainsProp ?? chainsState ?? []).map((chainKey) => {
            const chain = NetworksConfig[chainKey];

            return (
              <chain.logo.square.component
                key={chainKey}
                width={chain.logo.square.preferredHeight * 1.5}
                height={chain.logo.square.preferredHeight * 1.5}
              />
            );
          })
        )}
      </div>

      {right ? <div className="c-account-card_right">{right}</div> : null}
    </Surface>
  );
};
