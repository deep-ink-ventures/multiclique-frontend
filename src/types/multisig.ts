export type Signatory = {
  name: string;
  address: string;
};

export interface Multisig {
  name: string;
  address: string;
  signatories: Signatory[];
  threshold: number;
}

export interface MultiCliqueAccount {
  address: string;
  publicKeys: string[];
  defaultThreshold: string;
  policy: string;
}
