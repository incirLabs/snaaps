import {Env, InternalSnapMethod} from 'common';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import {Link, useNavigate} from 'react-router-dom';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {AccountCard, ActivityIndicator, Button, PageContainer} from '../../components';
import {useMount} from '../../hooks';
import {invokeSnap} from '../../utils/Snap';
import {getWalletAddress} from '../../utils/Networks';
import {Paths} from '../Paths';

import './styles.scss';

type Signer = {address: string; index: number};
type Wallet = Signer & {
  walletAddress: string;
};

const CreateNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [addedWallets, setAddedWallets] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

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

    const newWallets = (
      await Promise.all(
        signers.map(async (signer: Signer) => {
          const walletAddress = await getWalletAddress(signer.address);

          return {
            ...signer,
            walletAddress,
          };
        }),
      )
    ).filter((wallet) => !!wallet);

    setLoading(false);
    setWallets([...wallets, ...newWallets].sort((a, b) => a.index - b.index));
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
      address: wallet.walletAddress,
      signerIndex: wallet.index,
    });

    navigate(Paths.MySnaap(account.address).Networks);
  };

  return (
    <PageContainer className={cx('p-create-new')}>
      <PageContainer.Card className="p-create-new_content" title="Create a new AA Wallet">
        <div className="p-create-new_wallets">
          {wallets.map((wallet) => (
            <AccountCard
              key={wallet.address}
              text={`${wallet.index + 1} - ${wallet.walletAddress}`}
              walletAddress={wallet.walletAddress}
              right={
                addedWallets.includes(wallet.walletAddress) ? (
                  <Button theme="chip" as={Link} to={Paths.MySnaap(wallet.walletAddress).MySnaap}>
                    Configure
                  </Button>
                ) : (
                  <Button theme="chip" color="dark" onClick={() => onSetupClick(wallet)}>
                    Setup
                  </Button>
                )
              }
            />
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
