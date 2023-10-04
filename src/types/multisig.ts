export type Signatory = {
  name: string;
  address: string;
};

export interface RawMultisig {
  name: string;
  address: string;
  signatories: Signatory[];
  default_threshold: number;
  policy: string;
}

export interface Multisig {
  name: string;
  address: string;
  signatories: Signatory[];
  defaultThreshold: number;
  policy: string;
}
