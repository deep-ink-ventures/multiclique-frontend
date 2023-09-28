export type Signatory = {
  name: string;
  address: string;
};

// TODO: Merge with MultiCliqueAccount when service is updated
export interface Multisig {
  name: string;
  address: string;
  signatories: Signatory[];
  defaultThreshold: number;
  policy: string;
}

export interface RawMultisig {
  name: string;
  address: string;
  signatories: {
    name: string;
    public_key: string; // fixme this will change to "address"
  };
  default_threshold: number;
  policy: string;
}
