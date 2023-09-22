export enum MultiSigTransactionStatus {
  Pending = 'PENDING',
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
}

export interface RawMultisigTransaction {
  xdr: string;
  preimage_hash: string;
  call_func: string;
  call_args: Record<string, any>;
  approvers: string[];
  rejecters: string[];
  status: MultiSigTransactionStatus;
  executed_at: Date;
  created_at: Date;
  updated_at: Date;
  multiclique_address: string;
  default_threshold: number;
  public_keys: string[];
}

export interface MultisigTransaction {
  xdr: string;
  preimageHash: string;
  callFunc: string;
  callArgs: Record<string, any>;
  approvers: string[];
  rejecters: string[];
  status: MultiSigTransactionStatus;
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  multicliqueAddress: string;
  defaultThreshold: number;
  publicKeys: string[];
}
