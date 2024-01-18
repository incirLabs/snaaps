import type {TransactionLog, TransactionReceipt} from './transaction';

export type UserOpHash = string;

export type UserOpStatus =
  | 'not_found'
  | 'not_submitted'
  | 'submitted'
  | 'rejected'
  | 'included'
  | 'failed'
  | 'queued';

export type GasPrice = {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

export type GetGasPriceResult = {
  slow: GasPrice;
  standard: GasPrice;
  fast: GasPrice;
};

export type SponsorUserOpResult = {
  paymasterAndData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
};

export type SendUserOpResult = UserOpHash;

export type GetUserOpReceiptResult = {
  userOpHash: string;
  sender: string;
  nonce: string;
  actualGasUsed: string;
  actualGasCost: string;
  success: boolean;
  logs: TransactionLog[];
  receipt: TransactionReceipt;
};

export type GetUserOpStatusResult = {
  status: UserOpStatus;
  transactionHash?: string | null;
};

export type WaitForUserOpReceiptResult =
  | {
      success: true;
      receipt: TransactionReceipt;
      transactionHash: string;
    }
  | {
      success: false;
      error: 'timeout' | 'not_found' | 'rejected';
    };
