import type BigNumber from 'bignumber.js';

export type Signatory = {
  name: string;
  address: string;
};

export interface Signature {
  signature: string;
  signatory: Signatory;
}

export type MultiCliqueContract = {
  address: string;
  limit: BigNumber;
  alreadySpent: BigNumber;
  type: string;
};

export type RawMultiCliqueContract = {
  address: string;
  limit: BigNumber;
  already_spent: BigNumber;
  type: string;
};

export type RawMultiCliquePolicy = {
  address: string;
  name: string;
  contracts: RawMultiCliqueContract[] | null;
};

export type MultiCliquePolicy = {
  address: string;
  name: string;
  contracts: MultiCliqueContract[] | null;
};

export interface RawMultiCliqueAccount {
  name: string;
  address: string;
  signatories: Signatory[];
  default_threshold: number;
  policy: RawMultiCliquePolicy;
}

export interface MultiCliqueAccount {
  name: string;
  address: string;
  signatories: Signatory[];
  defaultThreshold: number;
  policy: MultiCliquePolicy;
}
