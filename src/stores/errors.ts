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
    0: 'ContractPolicyExists',
    1: 'ContractPolicyDoesNotExist',
    3: 'UnknownSigner',
    4: 'DefaultThresholdNotMet',
    5: 'PolicyThresholdNotMet',
    6: 'SignerDoesNotExist',
    7: 'AlreadyInitialized',
    8: 'InvalidThreshold',
    9: 'SignerAlreadyAdded',
    10: 'NewConditionError',
    11: 'UnauthorizedAction',
    12: 'InvalidParameter',
    13: 'NetworkIssue',
    14: 'TimeoutError',
  },
  multicliquePolicy: {
    0: 'AlreadyInitialized',
    1: 'SpendLimitExceeded',
  },
};
