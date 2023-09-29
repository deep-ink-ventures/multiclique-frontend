export interface ContractErrorCodes {
  multicliqueCore: {
    [key: string]: string;
  };
  multicliquePolicy: {
    [key: string]: string;
  };
}

export const contractErrorCodes: ContractErrorCodes = {
  multicliqueCore: {
    1000: 'ContractPolicyExists',
    1001: 'ContractPolicyDoesNotExist',
    1003: 'UnknownSigner',
    1004: 'DefaultThresholdNotMet',
    1005: 'PolicyThresholdNotMet',
    1006: 'SignerDoesNotExist',
    1007: 'AlreadyInitialized',
    1008: 'InvalidThreshold',
    1009: 'SignerAlreadyAdded',
  },
  multicliquePolicy: {
    1100: 'AlreadyInitialized',
    1101: 'SpendLimitExceeded',
  },
};
