import type { Multisig } from '@/types/multisig';
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
    threshold: 2,
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
    threshold: 1,
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
    threshold: 1,
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
    threshold: 2,
  },
];

export const fakeMultisigTransactions = [
  {
    id: 1,
    multisigAddress: 'G12345ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
    callHash: 'callHash1',
    status: MultiSigTransactionStatus.Pending,
    createdAt: '2023-09-16T12:00:00Z',
    updatedAt: '2023-09-16T13:00:00Z',
  },
  {
    id: 2,
    multisigAddress: 'G23456ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
    callHash: 'callHash2',
    status: MultiSigTransactionStatus.Cancelled,
    canceledBy: 'G34567ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
    createdAt: '2023-09-15T12:00:00Z',
    updatedAt: '2023-09-15T14:00:00Z',
  },
  {
    id: 3,
    multisigAddress: 'G34567ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
    callHash: 'callHash3',
    status: MultiSigTransactionStatus.Executed,
    executedAt: '2023-09-14T12:00:00Z',
    createdAt: '2023-09-14T15:00:00Z',
    updatedAt: '2023-09-14T16:00:00Z',
  },
  {
    id: 4,
    multisigAddress: 'G45678ABCDEF67890GHIJKL12345MNOPQRSTUV67890WXYZabcdefghi',
    callHash: 'callHash4',
    status: MultiSigTransactionStatus.Pending,
    createdAt: '2023-09-13T12:00:00Z',
    updatedAt: '2023-09-13T17:00:00Z',
  },
];
