import {addHexPrefix, privateToAddress, stripHexPrefix} from '@ethereumjs/util';

export const getSignerPrivateKey = async (index: number) => {
  return stripHexPrefix(
    await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
        salt: `signer_${index}`,
      },
    }),
  );
};

export const privateKeyToAddress = async (privateKey: string) => {
  return addHexPrefix(
    privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex'),
  ) as `0x${string}`;
};

export const getSignerAddress = async (index: number) => {
  const privateKey = await getSignerPrivateKey(index);

  return privateKeyToAddress(privateKey);
};
