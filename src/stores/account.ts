/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

import { AccountService } from '@/services';
import type { Multisig } from '@/types/multisig';
import type { MCState } from './MCStore';

export type AccountSlice = {
  multisig: {
    loading: boolean;
    failed: boolean;
    data: Multisig | null;
    getMultisigAccount: (address: string) => void;
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
      getMultisigAccount: (address: string) => {
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
  },
});
