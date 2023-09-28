import type { CamelCaseObject } from '@/utils/transformer';
import type { RawSignatory } from './multisig';

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
  signatories: RawSignatory[];
}

export type MultisigTransaction = CamelCaseObject<RawMultisigTransaction>;
