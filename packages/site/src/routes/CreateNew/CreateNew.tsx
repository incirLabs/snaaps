import {useState} from 'react';
import {InternalSnapMethod} from 'common';
import cx from 'classnames';
import {Link} from 'react-router-dom';
import {ActivityIndicator, Button, PageContainer, Surface} from '../../components';
import {GetAAStatusResponse, useGetAAStatus, useMount} from '../../hooks';
import {invokeSnap} from '../../utils/Snap';
import {Paths} from '../Paths';

import {EthereumLogoSquare} from '../../assets/Networks/EthereumLogoSquare';

import './styles.scss';

type Signer = {address: string; index: number};

const CreateNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<(Signer & {status: GetAAStatusResponse})[]>([]);
  const [page, setPage] = useState(0);

  const getAAStatus = useGetAAStatus();

  const getWallets = async () => {
    if (loading) return;
    setLoading(true);

    const signers = await invokeSnap({
      method: InternalSnapMethod.GetAvailableSigners,
      params: {
        page,
      },
    });

    if (!signers || !Array.isArray(signers)) return;

    const signersWithStatus = (
      await Promise.all(
        signers.map(async (signer: Signer) => {
          return {
            ...signer,
            status: await getAAStatus(signer.address),
          };
        }),
      )
    ).filter((signer) => signer.status.status);

    setLoading(false);
    setWallets([...wallets, ...signersWithStatus]);
    setPage(page + 1);
  };

  useMount(() => {
    getWallets();
  });

  return (
    <PageContainer className={cx('p-create-new')}>
      <PageContainer.Card className="p-create-new_content" title="Create a new AA Wallet">
        <div className="p-create-new_wallets">
          {wallets.map((wallet) => (
            <Surface className="p-create-new_wallet">
              <span>{wallet.address}</span>

              <div className="p-create-new_wallet_chains">
                <EthereumLogoSquare width={30} height={30} />
              </div>

              <Button theme="chip" color="dark" as={Link} to={Paths.MySnaap.Networks}>
                Setup
              </Button>
            </Surface>
          ))}
        </div>

        {loading ? (
          <ActivityIndicator size="normal" className="w-100" />
        ) : (
          <Button theme="chip" onClick={() => getWallets()}>
            Load More
          </Button>
        )}
      </PageContainer.Card>
    </PageContainer>
  );
};

export default CreateNew;
