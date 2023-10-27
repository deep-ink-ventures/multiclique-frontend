import type { CamelCaseObject } from '@/utils/transformer';
import type { Signatory, Signature } from './multiCliqueAccount';

export enum MultiSigTransactionStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Executed = 'EXECUTED',
  Executable = 'EXECUTABLE',
}

export interface RawMultisigTransaction {
  id: number;
  xdr: string;
  preimage_hash: string;
  call_func: string;
  call_args: Record<string, any> | string[];
  approvals?: Signature[];
  rejections?: Signature[];
  status: MultiSigTransactionStatus;
  executed_at: string;
  created_at: string;
  updated_at: string;
  multiclique_address: string;
  default_threshold: number;
  signatories: Signatory[];
  submitter?: {
    address: string;
    name?: string;
  };
}

export type MultisigTransaction = CamelCaseObject<RawMultisigTransaction>;
