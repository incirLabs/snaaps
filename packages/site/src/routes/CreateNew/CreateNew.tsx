import {InternalSnapMethod} from 'common';
import {useState} from 'react';
import cx from 'classnames';
import {Link, useNavigate} from 'react-router-dom';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {AccountCard, ActivityIndicator, Button, PageContainer} from '../../components';
import {useMount, useSnapAccounts} from '../../hooks';
import {invokeSnap} from '../../utils/Snap';
import {getWalletAddress} from '../../utils/Networks';
import {SNAP_ORIGIN} from '../../utils/Env';
import {Paths} from '../Paths';

import './styles.scss';

type Signer = {address: string; index: number};
type Wallet = Signer & {
  walletAddress: string;
};

const CreateNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const [snapAccounts, reloadSnapAccounts] = useSnapAccounts();

  const snapAccountAddresses = Object.keys(snapAccounts);

  const getWallets = async () => {
    if (loading) return;
    setLoading(true);

    const signers = await invokeSnap({
      method: InternalSnapMethod.GetAvailableSigners,
      params: {
        page,
      },
    });

    if (!signers || !Array.isArray(signers)) {
      setLoading(false);
      return;
    }

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

  useMount(() => {
    getWallets();
    reloadSnapAccounts();
  });

  const onSetupClick = async (wallet: Wallet) => {
    try {
      const client = new KeyringSnapRpcClient(SNAP_ORIGIN, window.ethereum);

      const account = await client.createAccount({
        address: wallet.walletAddress,
        signerIndex: wallet.index,
      });

      navigate(Paths.MySnaap(account.address).Networks);
    } catch (error) {
      console.error(error);
    } finally {
      reloadSnapAccounts();
    }
  };

  return (
    <PageContainer className={cx('p-create-new')}>
      <PageContainer.Card className="p-create-new_content" title="Create a new AA Wallet">
        <span className="mt-1 mb-4">
          These are the accounts you can use. They are generated through your MetaMask mnemonic.
          <br />
          If you reinstall MetaMask with the same mnemonic, the same accounts will be generated.
        </span>

        <div className="p-create-new_wallets">
          {wallets.map((wallet) => (
            <AccountCard
              key={wallet.address}
              text={`${wallet.index + 1} - ${wallet.walletAddress}`}
              walletAddress={wallet.walletAddress}
              right={
                snapAccountAddresses.includes(wallet.walletAddress.toLowerCase()) ? (
                  <Button
                    theme="rounded"
                    className="d-block w-100"
                    as={Link}
                    to={Paths.MySnaap(wallet.walletAddress).MySnaap}
                  >
                    Configure
                  </Button>
                ) : (
                  <Button
                    theme="rounded"
                    color="dark"
                    className="d-block w-100"
                    onClick={() => onSetupClick(wallet)}
                  >
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
