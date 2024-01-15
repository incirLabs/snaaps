import {useEffect} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {PageContainer} from '../PageLayout/PageContainer';
import {Header} from '../Header/Header';
import {Footer} from '../Footer/Footer';
import {useDeployedNetworks, useSignerAddress} from '../../hooks';

import './styles.scss';

export const MySnaapPageLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const {address} = useParams();

  const {deployedNetworks, loading: networksLoading} = useDeployedNetworks(address);
  const {signerAddress, loading: signerLoading} = useSignerAddress();

  useEffect(() => {
    if (signerLoading || networksLoading) return;

    if (deployedNetworks.length === 0) {
      // TODO: Redirect to Networks
    }

    if (!signerAddress) {
      // TODO: Redirect to My Snaaps
    }
  }, [signerLoading, networksLoading, deployedNetworks.length, signerAddress]);

  return (
    <div className="c-my-snaap-page-layout">
      <PageContainer area="top">
        <Header networks={deployedNetworks} walletAddress={address} />
      </PageContainer>

      {children}

      <Outlet />

      <PageContainer area="bottom">
        <Footer />
      </PageContainer>
    </div>
  );
};
