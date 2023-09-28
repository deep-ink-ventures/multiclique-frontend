import type { CamelCaseObject } from '@/utils/transformer';

export type RawSignatory = {
  name: string;
  public_key: string;
};

export type Signatory = CamelCaseObject<RawSignatory>;

export interface RawMultisig {
  name: string;
  address: string;
  signatories: RawSignatory[];
  default_threshold: number;
  policy: string;
}

export type Multisig = CamelCaseObject<RawMultisig>;
