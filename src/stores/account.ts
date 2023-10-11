/* eslint-disable no-param-reassign */
import type { ListMultiCliqueAccountsParams } from '@/services/accounts';
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import type { ListMultiCliqueTransactionsParams } from '@/services';
import { AccountService, TransactionService } from '@/services';
import type { JwtToken } from '@/types/auth';
import type { Multisig } from '@/types/multisig';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import type { Paginated } from '@/types/response';
import type { MCState } from './MCStore';

export type AccountSlice = {
  multisig: {
    loading: boolean;
    failed: boolean;
    data: Multisig | null;
    getMultisigAccount: (address: string) => void;
  };
  multisigAccounts: {
    loading: boolean;
    failed: boolean;
    data: Paginated<Multisig[]> | null;
    getMultisigAccounts: (params: ListMultiCliqueAccountsParams) => void;
  };
  transactions: {
    loading: boolean;
    failed: boolean;
    data: Paginated<MultisigTransaction[]> | null;
    getMultisigTransaction: (
      params: ListMultiCliqueTransactionsParams,
      jwt: JwtToken
    ) => void;
  };
};

export const createAccountSlice: StateCreator<
  MCState,
  [],
  [],
  { account: AccountSlice }
> = (set) => ({
  account: {
    multisig: {
      loading: false,
      data: null,
      failed: false,
      getMultisigAccount: (address) => {
        set(
          produce((state: MCState) => {
            state.pages.account.multisig.loading = true;
          })
        );
        AccountService.getMultiCliqueAccount(address)
          .then(async (response) => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisig.data = response;
              })
            );
          })
          .catch(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisig.failed = true;
              })
            );
          })
          .finally(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisig.loading = false;
              })
            );
          });
      },
    },
    multisigAccounts: {
      loading: false,
      data: null,
      failed: false,
      getMultisigAccounts: (params?: ListMultiCliqueAccountsParams) => {
        set(
          produce((state: MCState) => {
            state.pages.account.multisig.loading = true;
          })
        );
        AccountService.listMultiCliqueAccounts(params)
          .then(async (response) => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisigAccounts.data = response;
              })
            );
          })
          .catch(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisigAccounts.failed = true;
              })
            );
          })
          .finally(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.multisigAccounts.loading = false;
              })
            );
          });
      },
    },
    transactions: {
      loading: false,
      data: null,
      failed: false,
      getMultisigTransaction: (params, jwt) => {
        set(
          produce((state: MCState) => {
            state.pages.account.multisig.loading = true;
          })
        );
        TransactionService.listMultiCliqueTransactions(params, jwt)
          .then(async (response) => {
            set(
              produce((state: MCState) => {
                state.pages.account.transactions.data = response;
              })
            );
          })
          .catch(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.transactions.failed = true;
              })
            );
          })
          .finally(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.transactions.loading = false;
              })
            );
          });
      },
    },
  },
});
