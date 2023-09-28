import type { Multisig } from '@/types/multisig';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import { MultiSigTransactionStatus } from '@/types/multisigTransaction';

export const fakeMultisigAccounts: Multisig[] = [
  {
    name: 'Multisig Account 1',
    address: 'C12345ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghijkl',
    signatories: [
      {
        name: 'Signatory 1',
        address: 'G12345ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
      {
        name: 'Signatory 2',
        address: 'G23456ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
      {
        name: 'Signatory 3',
        address: 'G34567ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
    ],
    defaultThreshold: 2,
    policy: 'ELIO_DAO',
  },
  {
    name: 'Multisig Account 2',
    address: 'C23456ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghijkl',
    signatories: [
      {
        name: 'Signatory 4',
        address: 'G45678ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
      {
        name: 'Signatory 5',
        address: 'G56789ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
    ],
    defaultThreshold: 1,
    policy: 'ELIO_DAO',
  },
  {
    name: 'Multisig Account 3',
    address: 'C34567ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghijkl',
    signatories: [
      {
        name: 'Signatory 6',
        address: 'G67890ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
      {
        name: 'Signatory 7',
        address: 'G78901ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
    ],
    defaultThreshold: 1,
    policy: 'ELIO_DAO',
  },
  {
    name: 'Multisig Account 4',
    address: 'C45678ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghijkl',
    signatories: [
      {
        name: 'Signatory 8',
        address: 'G89012ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
      {
        name: 'Signatory 9',
        address: 'G90123ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
      },
    ],
    defaultThreshold: 2,
    policy: 'ELIO_DAO',
  },
];

export const fakeMultisigTransactions: MultisigTransaction[] = [
  {
    xdr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123', // Replace with your Base64 hash
    preimageHash: 'PreimageHash1',
    callFunc: 'CallFunc1',
    callArgs: {},
    approvers: [
      'GCIDMRY5GZDY7P7BLO5DEIMDQ57AHRTU32NXIIDWGE4P7WPTQSEJPCGW',
      'GCVLEO7LQKXTOC2PGBEX4Z2YLYXNQSFESBKGASSEZTPHNUYQI6STGCDN',
    ],
    rejecters: [],
    status: MultiSigTransactionStatus.Pending,
    executedAt: new Date('2023-09-16T12:00:00Z'),
    createdAt: new Date('2023-09-16T13:00:00Z'),
    updatedAt: new Date('2023-09-16T14:00:00Z'),
    multicliqueAddress:
      'C12345ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi', // Replace with your contract ID
    defaultThreshold: 2,
    publicKeys: [
      'GCIDMRY5GZDY7P7BLO5DEIMDQ57AHRTU32NXIIDWGE4P7WPTQSEJPCGW',
      'GCVLEO7LQKXTOC2PGBEX4Z2YLYXNQSFESBKGASSEZTPHNUYQI6STGCDN',
    ],
  },
  {
    xdr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123', // Replace with your Base64 hash
    preimageHash: 'PreimageHash2',
    callFunc: 'CallFunc2',
    callArgs: {},
    approvers: [],
    rejecters: ['GCIDMRY5GZDY7P7BLO5DEIMDQ57AHRTU32NXIIDWGE4P7WPTQSEJPCGW'],
    status: MultiSigTransactionStatus.Cancelled,
    executedAt: new Date('2023-09-15T12:00:00Z'),
    createdAt: new Date('2023-09-15T13:00:00Z'),
    updatedAt: new Date('2023-09-15T14:00:00Z'),
    multicliqueAddress:
      'C23456ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi', // Replace with your contract ID
    defaultThreshold: 1,
    publicKeys: ['GCIDMRY5GZDY7P7BLO5DEIMDQ57AHRTU32NXIIDWGE4P7WPTQSEJPCGW'],
  },
  {
    xdr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123', // Replace with your Base64 hash
    preimageHash: 'PreimageHash3',
    callFunc: 'CallFunc3',
    callArgs: {},
    approvers: ['GCVLEO7LQKXTOC2PGBEX4Z2YLYXNQSFESBKGASSEZTPHNUYQI6STGCDN'],
    rejecters: [],
    status: MultiSigTransactionStatus.Executed,
    executedAt: new Date('2023-09-14T12:00:00Z'),
    createdAt: new Date('2023-09-14T13:00:00Z'),
    updatedAt: new Date('2023-09-14T14:00:00Z'),
    multicliqueAddress:
      'C34567ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi', // Replace with your contract ID
    defaultThreshold: 1,
    publicKeys: ['GCIDMRY5GZDY7P7BLO5DEIMDQ57AHRTU32NXIIDWGE4P7WPTQSEJPCGW'],
  },
];
