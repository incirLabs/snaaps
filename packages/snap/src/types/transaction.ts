export type TransactionLog = {
  address: string;
  data: string;
  blockHash?: string | null;
  blockNumber?: string | null;
  logIndex?: string | null;
  transactionHash?: string | null;
  transactionIndex?: string | null;
  removed: boolean;
};

export type TransactionReceipt = {
  blockHash: string;
  blockNumber: string;
  contractAddress?: string | null;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  logs: TransactionLog[];
  logsBloom: string;
  status: string;
  to?: string | null;
  transactionHash: string;
  transactionIndex: string;
  type: string;
};
