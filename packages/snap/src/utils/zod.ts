import {z} from 'zod';

export const CreateAccountOptionsSchema = z
  .object({
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  })
  .and(
    z.union([
      z.object({
        signerIndex: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
      }),
      z.object({
        privateKey: z.string().regex(/^(0x)?[a-fA-F0-9]{64}$/),
      }),
    ]),
  );

export const AccountOptionsSchema = z.object({
  signerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
