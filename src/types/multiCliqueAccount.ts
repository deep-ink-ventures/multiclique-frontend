import type { CamelCaseObject } from '@/utils/transformer';
import type BigNumber from 'bignumber.js';

export type Signatory = {
  name: string;
  address: string;
};

export type RawMultiCliqueContract = {
  address: string;
  limit: BigNumber;
  already_spent: BigNumber;
  type: string;
};

export type MultiCliqueContract = CamelCaseObject<RawMultiCliqueContract>;

export type RawMultiCliquePolicy = {
  address: string;
  name: string;
  contracts: RawMultiCliqueContract[] | null;
};

export type MultiCliquePolicy = CamelCaseObject<RawMultiCliquePolicy>;

export interface RawMultiCliqueAccount {
  name: string;
  address: string;
  signatories: Signatory[];
  default_threshold: number;
  policy: RawMultiCliquePolicy;
}

export interface Signature {
  signature: string;
  signatory: Signatory;
}

export type MultiCliqueAccount = CamelCaseObject<RawMultiCliqueAccount>;
