import {addHexPrefix, privateToAddress, stripHexPrefix} from '@ethereumjs/util';

export const getSignerPrivateKey = async (index: number) => {
  try {
    return stripHexPrefix(
      await snap.request({
        method: 'snap_getEntropy',
        params: {
          version: 1,
          salt: `signer_${index}`,
        },
      }),
    );
  } catch (e) {
    throw new Error(`Failed to get signer private key for index ${index}`);
  }
};

export const privateKeyToAddress = async (privateKey: string) => {
  try {
    return addHexPrefix(
      privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex'),
    ) as `0x${string}`;
  } catch (e) {
    throw new Error(`Failed to get the address`);
  }
};

export const getSignerAddress = async (index: number) => {
  const privateKey = await getSignerPrivateKey(index);

  return privateKeyToAddress(privateKey);
};
