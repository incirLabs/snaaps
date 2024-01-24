import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {KeyringAccount, KeyringSnapRpcClient} from '@metamask/keyring-api';
import {useAccountEffect} from 'wagmi';
import {SNAP_ORIGIN} from '../utils/Env';

export type SnapAccountsContextType = [
  snapAccounts: Record<string, KeyringAccount>,
  reloadSnapAccounts: () => Promise<void>,
  loading: boolean,
];

export type SnapAccountsProviderProps = {
  children: React.ReactNode;
};

export const SnapAccountsContext = createContext<SnapAccountsContextType>([
  {},
  async () => {
    // Noop
  },
  true,
]);

export const SnapAccountsProvider: React.FC<SnapAccountsProviderProps> = (props) => {
  const {children} = props;

  const [snapAccounts, setSnapAccounts] = useState<SnapAccountsContextType[0]>({});
  const [loading, setLoading] = useState(true);

  const reloadSnapAccounts = useCallback(async () => {
    setLoading(true);

    try {
      const client = new KeyringSnapRpcClient(SNAP_ORIGIN, window.ethereum);

      const accounts = await client.listAccounts();

      setSnapAccounts(Object.fromEntries(accounts.map((account) => [account.address, account])));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadSnapAccounts();
  }, [reloadSnapAccounts]);

  useAccountEffect({
    onConnect: reloadSnapAccounts,
    onDisconnect: reloadSnapAccounts,
  });

  const context = useMemo(
    () => [snapAccounts, reloadSnapAccounts, loading],
    [snapAccounts, reloadSnapAccounts, loading],
  ) as SnapAccountsContextType;

  return <SnapAccountsContext.Provider value={context}>{children}</SnapAccountsContext.Provider>;
};

export const useSnapAccounts = (): SnapAccountsContextType => {
  return useContext(SnapAccountsContext);
};
