import {useEffect} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {PageContainer} from '../PageLayout/PageContainer';
import {Header} from '../Header/Header';
import {Footer} from '../Footer/Footer';
import {useDeployedNetworks} from '../../hooks';

import './styles.scss';

export const MySnaapPageLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const {address} = useParams();

  const {deployedNetworks, loading} = useDeployedNetworks(address);

  useEffect(() => {
    if (loading) return;

    if (deployedNetworks.length === 0) {
      // TODO: Redirect to Networks
    }
  }, [deployedNetworks.length, loading]);

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
