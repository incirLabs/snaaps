import {Env} from 'common';
import {SimpleAccount, SimpleAccountFactory} from 'contracts';
import {constants} from 'ethers';
import {useContract} from '@incirlabs/react-ethooks';

export const useSimpleAccount = (address?: string) => {
  return useContract(address ?? constants.AddressZero, SimpleAccount);
};

export const useSimpleAccountFactory = () => {
  return useContract(Env.ACCOUNT_FACTORY_ADDRESS ?? constants.AddressZero, SimpleAccountFactory);
};
