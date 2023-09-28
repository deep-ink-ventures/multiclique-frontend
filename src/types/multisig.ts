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
  name: string;
  address: string;
  signatories: string[];
  defaultThreshold: string;
  policy: string;
}
