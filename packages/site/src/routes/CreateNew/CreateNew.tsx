import {Env, InternalSnapMethod} from 'common';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import {Link, useNavigate} from 'react-router-dom';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {ActivityIndicator, Button, PageContainer, Surface} from '../../components';
import {GetAAStatusResponseSuccess, useGetAAStatus, useMount} from '../../hooks';
import {NetworksConfig} from '../../utils/NetworksConfig';
import {invokeSnap} from '../../utils/Snap';
import {Paths} from '../Paths';

import './styles.scss';

type Signer = {address: string; index: number};
type Wallet = Signer & {status: GetAAStatusResponseSuccess};

const CreateNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [addedWallets, setAddedWallets] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
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
          const aaStatus = await getAAStatus(signer.address);
          if (!aaStatus.status) return null;

          return {
            ...signer,
            status: aaStatus,
          };
        }),
      )
    ).filter((signer): signer is Wallet => !!signer);

    setLoading(false);
    setWallets([...wallets, ...signersWithStatus]);
    setPage(page + 1);
  };

  useEffect(() => {
    (async () => {
      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const accounts = await client.listAccounts();

      setAddedWallets(accounts.map((account) => account.address));
    })();
  }, []);

  useMount(() => {
    getWallets();
  });

  const onSetupClick = async (wallet: Wallet) => {
    const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

    const account = await client.createAccount({
      address: wallet.status.address,
      signerIndex: wallet.index,
    });

    navigate(Paths.MySnaap.Networks);
  };

  return (
    <PageContainer className={cx('p-create-new')}>
      <PageContainer.Card className="p-create-new_content" title="Create a new AA Wallet">
        <div className="p-create-new_wallets">
          {wallets.map((wallet) => (
            <Surface key={wallet.address} className="p-create-new_wallet">
              <span>{wallet.status.address}</span>

              <div className="p-create-new_wallet_chains">
                {wallet.status.chains.map((chainKey) => {
                  const chain = NetworksConfig[chainKey];

                  return (
                    <chain.logo.square.component
                      width={chain.logo.square.preferredHeight * 1.5}
                      height={chain.logo.square.preferredHeight * 1.5}
                    />
                  );
                })}
              </div>

              {addedWallets.includes(wallet.status.address) ? (
                <Button theme="chip" as={Link} to={Paths.MySnaap.Networks}>
                  Configure
                </Button>
              ) : (
                <Button theme="chip" color="dark" onClick={() => onSetupClick(wallet)}>
                  Setup
                </Button>
              )}
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
