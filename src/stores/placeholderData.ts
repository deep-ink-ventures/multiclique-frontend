import type { Multisig } from '@/types/multisig';

export const multisigAccounts: Multisig[] = [
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
