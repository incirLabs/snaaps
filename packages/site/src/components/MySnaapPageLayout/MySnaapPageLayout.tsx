import {useEffect} from 'react';
import {Outlet, Link, useNavigate, useParams} from 'react-router-dom';
import {PageContainer} from '../PageLayout/PageContainer';
import {Header} from '../Header/Header';
import {Footer} from '../Footer/Footer';
import {Surface} from '../Surface/Surface';
import {Button} from '../Button/Button';
import {ActivityIndicator} from '../ActivityIndicator/ActivityIndicator';
import {useDeployedNetworks, useSignerAddress} from '../../hooks';
import {Paths} from '../../routes/Paths';

import {NetworksLogos} from '../../assets/NetworksLogos';
import {PlusIcon} from '../../assets/Icons/PlusIcon';

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
        <Header
          right={
            <div className="c-my-snaap-page-layout_header">
              <Surface className="c-my-snaap-page-layout_header_card">
                <div className="c-my-snaap-page-layout_header_networks">
                  <Link
                    to={Paths.MySnaap(address ?? '').Networks}
                    className="c-my-snaap-page-layout_header_add-button"
                  >
                    <PlusIcon width={14} height={14} />
                  </Link>

                  {networksLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <>
                      {deployedNetworks.map((networkKey) => {
                        const logo = NetworksLogos[networkKey];

                        return (
                          <logo.square.component
                            key={networkKey}
                            width={logo.square.preferredHeight * 1.2}
                            height={logo.square.preferredHeight * 1.2}
                          />
                        );
                      })}
                    </>
                  )}
                </div>

                <Button theme="rounded">Connected</Button>
              </Surface>
            </div>
          }
        />
      </PageContainer>

      {children}

      <Outlet />

      <PageContainer area="bottom">
        <Footer />
      </PageContainer>
    </div>
  );
};
