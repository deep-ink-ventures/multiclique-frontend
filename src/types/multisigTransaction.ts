import type { CamelCaseObject } from '@/utils/transformer';
import type { Signatory } from './multiCliqueAccount';

export enum MultiSigTransactionStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Executed = 'EXECUTED',
  Executable = 'EXECUTABLE',
}

export interface RawMultisigTransaction {
  xdr: string;
  preimage_hash: string;
  call_func: string;
  call_args: Record<string, any>;
  approvals: string[];
  rejections: string[];
  status: MultiSigTransactionStatus;
  executed_at: string;
  created_at: string;
  updated_at: string;
  multiclique_address: string;
  default_threshold: number;
  signatories: Signatory[];
}

export type MultisigTransaction = CamelCaseObject<RawMultisigTransaction>;
