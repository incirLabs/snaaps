import {useContractRead} from '@incirlabs/react-ethooks';
import {useSimpleAccountFactory} from './Contracts';
import {NetworkKeys} from '../utils/NetworksConfig';
import {getContractDeployedChains} from '../utils/Networks';

export type GetAAStatusResponseError = {
  status: false;
};

export type GetAAStatusResponseSuccess = {
  status: true;
  address: string;
  chains: NetworkKeys[];
};

export type GetAAStatusResponse = GetAAStatusResponseError | GetAAStatusResponseSuccess;

export const useGetAAStatus = () => {
  const AccountFactory = useSimpleAccountFactory();
  const getAccountAddress = useContractRead(AccountFactory, 'getAddress');

  const getAAStatus = async (signer: string): Promise<GetAAStatusResponse> => {
    const aaAddressRes = await getAccountAddress([signer, 0]);

    if (!aaAddressRes.status) {
      console.error("Couldn't get AA address", aaAddressRes.error);
      return {
        status: false,
      };
    }

    const aaAddress = aaAddressRes.data;

    return {
      status: true,
      address: aaAddress,
      chains: await getContractDeployedChains(aaAddress),
    };
  };

  return getAAStatus;
};
