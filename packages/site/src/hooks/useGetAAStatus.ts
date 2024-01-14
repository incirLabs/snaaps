import {useContractRead, useProvider} from '@incirlabs/react-ethooks';
import {useSimpleAccountFactory} from './Contracts';
import {NetworksConfig} from '../utils/NetworksConfig';

export type GetAAStatusResponseError = {
  status: false;
};

export type GetAAStatusResponseSuccess = {
  status: true;
  address: string;
  chains: (keyof typeof NetworksConfig)[];
};

export type GetAAStatusResponse = GetAAStatusResponseError | GetAAStatusResponseSuccess;

export const useGetAAStatus = () => {
  const AccountFactory = useSimpleAccountFactory();
  const getAccountAddress = useContractRead(AccountFactory, 'getAddress');
  const provider = useProvider();

  const getAAStatus = async (signer: string): Promise<GetAAStatusResponse> => {
    const aaAddressRes = await getAccountAddress([signer, 0]);

    if (!aaAddressRes.status) {
      console.error("Couldn't get AA address", aaAddressRes.error);
      return {
        status: false,
      };
    }

    const aaAddress = aaAddressRes.data;

    try {
      // TODO: This check should be cross-chain compatible.
      const code = await provider.getCode(aaAddress);

      if (code !== '0x') {
        return {
          status: true,
          address: aaAddress,
          chains: ['ethereum'],
        };
      }

      return {
        status: true,
        address: aaAddress,
        chains: [],
      };
    } catch (e) {
      console.error("Couldn't get AA code", e);
      return {
        status: false,
      };
    }
  };

  return getAAStatus;
};
