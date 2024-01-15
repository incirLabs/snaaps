import {useEffect} from 'react';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {PageContainer} from '../PageLayout/PageContainer';
import {Header} from '../Header/Header';
import {Footer} from '../Footer/Footer';
import {useDeployedNetworks, useSignerAddress} from '../../hooks';
import {Paths} from '../../routes/Paths';

import './styles.scss';

export const MySnaapPageLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const {address} = useParams();
  const navigate = useNavigate();

  const {deployedNetworks, loading: networksLoading} = useDeployedNetworks(address);
  const {signerAddress, loading: signerLoading} = useSignerAddress(address);

  useEffect(() => {
    if (signerLoading || networksLoading) return;

    if (!signerAddress) {
      navigate(Paths.MySnaaps.Root, {replace: true});
    } else if (deployedNetworks.length === 0) {
      navigate(Paths.MySnaap(address ?? '').Networks, {replace: true});
    }
  }, [signerLoading, networksLoading, deployedNetworks.length, signerAddress, navigate, address]);

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
