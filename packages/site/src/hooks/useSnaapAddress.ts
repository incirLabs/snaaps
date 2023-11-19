import {SimpleAccount} from 'contracts';
import {useEffect, useState} from 'react';
import {Contract} from 'ethers';
import {useAccount, useContractRead, useProvider} from '@incirlabs/react-ethooks';
import {useSimpleAccountFactory} from './Contracts';

export const useSnaapAddress = () => {
  const {address} = useAccount();

  const provider = useProvider();

  const accountFactory = useSimpleAccountFactory();
  const getAddress = useContractRead(accountFactory, 'getAddress');

  const [snaapAddress, setSnaapAddress] = useState<
    {snaap: string; signer: string} | null | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      if (!address) return;

      try {
        const code = await provider.getCode(address);
        if (code !== '0x') {
          // Address is AA
          const aaContract = new Contract(address, SimpleAccount, provider);

          const owner = await aaContract.owner();

          setSnaapAddress({snaap: address, signer: owner});
          return;
        }

        // Address is EOA
        const result = await getAddress([address, 0]);

        if (!result.status) {
          console.error(result.error);
          setSnaapAddress(null);
          return;
        }

        setSnaapAddress({snaap: result.data, signer: address});
      } catch (error) {
        setSnaapAddress(null);
      }
    })();
  }, [address, getAddress, provider]);

  return snaapAddress;
};
