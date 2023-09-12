export interface ContractErrorCodes {
  core: {
    [key: string]: string;
  };
  votes: {
    [key: string]: string;
  };
  assets: {
    [key: string]: string;
  };
  multicliqueCore: {
    [key: string]: string;
  };
  multicliquePolicy: {
    [key: string]: string;
  };
}

export const contractErrorCodes: ContractErrorCodes = {
  core: {
    0: 'DaoAlreadyExists',
    1: 'DaoDoesNotExist',
    2: 'VotesAlreadyInitiated',
    3: 'NotDaoOwner',
    4: 'AssetAlreadyIssued',
    5: 'AssetNotIssued',
    6: 'NoMetadata',
    7: 'NoHookpoint',
    8: 'MustRemoveConfigFirst',
  },
  votes: {
    0: 'CoreAlreadyInitialized',
    1: 'NotDaoOwner',
    2: 'MaxProposalsReached',
    3: 'ProposalNotFound',
    4: 'ProposalStillActive',
    5: 'ProposalNotRunning',
    6: 'UnacceptedProposal',
    7: 'NotProposalOwner',
    8: 'MetadataNotFound',
    9: 'ConfigurationNotFound',
  },
  assets: {
    0: 'NegativeAmount',
    1: 'CheckpointIndexError',
    2: 'InsufficientAllowance',
    3: 'DaoAlreadyIssuedToken',
    4: 'NotTokenOwner',
    5: 'CanOnlyBeMintedOnce',
    6: 'InsufficientBalance',
    7: 'NoCheckpoint',
  },
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
