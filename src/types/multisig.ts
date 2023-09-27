export type Signatory = {
  name: string;
  address: string;
};

// TODO: Merge with MultiCliqueAccount when service is updated
export interface Multisig {
  name: string;
  address: string;
  signatories: Signatory[];
  threshold: number;
}

export interface MultiCliqueAccount {
  name: string;
  address: string;
  // TODO: replace with Signatory when service is updated
  signatories: string[];
  defaultThreshold: string;
  policy: string;
}
