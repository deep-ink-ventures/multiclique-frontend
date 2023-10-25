/* eslint-disable no-param-reassign */
import type { ListMultiCliqueAccountsParams } from '@/services/accounts';
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import type { ListMultiCliqueTransactionsParams } from '@/services';
import { AccountService, TransactionService } from '@/services';
import type {
  ListPolicyAssetsParams,
  MockPolicyAssets,
} from '@/services/assets';
import { AssetsService } from '@/services/assets';
import type { JwtToken } from '@/types/auth';
import type { MultiCliqueAccount } from '@/types/multiCliqueAccount';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import type { Paginated } from '@/types/response';
import type { MCState } from './MCStore';

export type AccountSlice = {
  multisig: {
    loading: boolean;
    failed: boolean;
    data: MultiCliqueAccount | null;
    getMultisigAccount: (address: string) => void;
  };
  multisigAccounts: {
    loading: boolean;
    failed: boolean;
    data: Paginated<MultiCliqueAccount[]> | null;
    getMultisigAccounts: (params: ListMultiCliqueAccountsParams) => void;
  };
  transactions: {
    loading: boolean;
    failed: boolean;
    fulfilled?: boolean;
    data: Paginated<MultisigTransaction[]> | null;
    getMultisigTransaction: (
      params: ListMultiCliqueTransactionsParams,
      jwt: JwtToken
    ) => void;
    clear: () => void;
  };
  assets: {
    loading: boolean;
    failed: boolean;
    fulfilled?: boolean;
    data: Paginated<MockPolicyAssets[]> | null;
    getPolicyAssets: (params: ListPolicyAssetsParams, jwt: JwtToken) => void;
    clear: () => void;
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
      fulfilled: false,
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
      fulfilled: false,
      getMultisigTransaction: (params, jwt) => {
        set(
          produce((state: MCState) => {
            state.pages.account.transactions.loading = true;
            state.pages.account.transactions.fulfilled = false;
            state.pages.account.transactions.failed = false;
          })
        );
        TransactionService.listMultiCliqueTransactions(params, jwt)
          .then(async (response) => {
            set(
              produce((state: MCState) => {
                state.pages.account.transactions.data = response;
                state.pages.account.transactions.fulfilled = true;
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
      clear: () => {
        set(
          produce((state: MCState) => {
            state.pages.account.transactions.loading = false;
            state.pages.account.transactions.data = null;
            state.pages.account.transactions.fulfilled = false;
            state.pages.account.transactions.failed = false;
          })
        );
      },
    },
    assets: {
      loading: false,
      data: null,
      failed: false,
      fulfilled: false,
      getPolicyAssets: (params, jwt) => {
        set(
          produce((state: MCState) => {
            state.pages.account.assets.loading = true;
            state.pages.account.assets.fulfilled = false;
            state.pages.account.assets.failed = false;
          })
        );
        AssetsService.listPolicyAssets(params, jwt)
          .then(async (response) => {
            set(
              produce((state: MCState) => {
                state.pages.account.assets.data = response;
                state.pages.account.assets.fulfilled = true;
              })
            );
          })
          .catch(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.assets.failed = true;
              })
            );
          })
          .finally(() => {
            set(
              produce((state: MCState) => {
                state.pages.account.assets.loading = false;
              })
            );
          });
      },
      clear: () => {
        set(
          produce((state: MCState) => {
            state.pages.account.transactions.loading = false;
            state.pages.account.transactions.data = null;
            state.pages.account.transactions.fulfilled = false;
            state.pages.account.transactions.failed = false;
          })
        );
      },
    },
  },
});
