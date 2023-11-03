import BigNumber from 'bignumber.js';
import StellarSdk from 'stellar-sdk';
import { create } from 'zustand';

import { splitCamelCase } from '@/utils';
import {
  getNetworkDetails,
  getPublicKey,
  isConnected,
} from '@stellar/freighter-api';
import * as SorobanClient from 'soroban-client';

import type { MultiCliqueAccount } from '@/types/multiCliqueAccount';
import type { MultisigTransaction } from '@/types/multisigTransaction';

import { getConfig } from '@/services/config';
import type { JwtToken } from '@/types/auth';
import type { ElioConfig } from '@/types/elioConfig';
import {
  NETWORK,
  NETWORK_PASSPHRASE,
  SOROBAN_RPC_ENDPOINT,
  XLM_UNITS,
} from '../config/index';
import type { AccountSlice } from './account';
import { createAccountSlice } from './account';
import { contractErrorCodes } from './errors';

export interface MCConfig {
  /** Block time in seconds */
  blockCreationInterval: number;
  networkPassphrase: string;
  rpcEndpoint: string;
  currentBlockNumber?: number;
}

export interface WalletAccount {
  isConnected: boolean;
  publicKey: string;
  network: string;
  networkUrl: string;
  networkPassphrase: string;
  nativeTokenBalance: BigNumber;
}

export enum TxnResponse {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
  Cancelled = 'CANCELLED',
}

export interface TxnNotification {
  title: string;
  message: string;
  type: TxnResponse;
  timestamp: number;
  txnHash?: string;
}

export type ContractName = 'multicliqueCore' | 'multicliquePolicy';

interface PageSlices {
  account: AccountSlice;
}

export interface MCState {
  currentWalletAccount: WalletAccount | null;
  txnNotifications: TxnNotification[];
  isTxnProcessing: boolean;
  isConnectModalOpen: boolean;
  sorobanServer: SorobanClient.Server;
  showCongrats: boolean;
  currentBlockNumber: number | null;
  MCConfig: MCConfig;
  multisigAccounts: MultiCliqueAccount[];
  multisigTransactions: MultisigTransaction[];
  elioConfig: ElioConfig | null;
  pages: PageSlices;
  jwt: JwtToken | null;
}

export interface MCActions {
  updateCurrentWalletAccount: (account: WalletAccount | null) => void;
  getWallet: () => void;
  addTxnNotification: (notification: TxnNotification) => void;
  removeTxnNotification: () => void;
  handleErrors: (
    errMsg: string,
    err?: Error,
    contractName?: ContractName
  ) => void;
  fetchNativeTokenBalance: (
    publickey: string,
    onError?: (err: any) => void
  ) => Promise<string | null | undefined>;
  updateIsConnectModalOpen: (isOpen: boolean) => void;
  handleTxnSuccessNotification: (
    response: SorobanClient.SorobanRpc.GetTransactionResponse,
    successMsg: string,
    txnHash?: string
  ) => void;
  updateIsTxnProcessing: (isProcessing: boolean) => void;
  updateMultisigAccounts: (accounts: MultiCliqueAccount[]) => void;
  updateMultisigTransactions: (transactions: MultisigTransaction[]) => void;
  fetchConfig: () => void;
  updateJwt: (jwt: JwtToken | null) => void;
}

export interface MCStore extends MCState, MCActions {}

const useMCStore = create<MCStore>((set, get, store) => ({
  currentWalletAccount: null,
  txnNotifications: [],
  isTxnProcessing: false,
  isConnectModalOpen: false,
  sorobanServer: new SorobanClient.Server(SOROBAN_RPC_ENDPOINT[NETWORK]),
  showCongrats: false,
  currentBlockNumber: null,
  MCConfig: {
    blockCreationInterval: 5,
    networkPassphrase: NETWORK_PASSPHRASE[NETWORK],
    rpcEndpoint: SOROBAN_RPC_ENDPOINT[NETWORK],
  },
  multisigAccounts: [],
  multisigTransactions: [],
  elioConfig: null,
  jwt: null,
  updateCurrentWalletAccount: (account: WalletAccount | null) => {
    set({ currentWalletAccount: account });
  },
  updateIsConnectModalOpen: (isOpen: boolean) => {
    set({ isConnectModalOpen: isOpen });
  },
  handleErrors: (
    errMsg: string,
    err?: Error | string,
    contractName?: ContractName
  ) => {
    set({ isTxnProcessing: false });
    // eslint-disable-next-line
    console.log(errMsg, err);
    let message = '';
    if (typeof err === 'object') {
      message = err.message;
    } else {
      message = errMsg;
    }

    const getErrorCode = (str: string | undefined) => {
      if (!str) {
        return null;
      }
      const startMarker = '#';
      const errorLines = str.split('\n');

      let errorCode: string | null = null;

      errorLines.some((line) => {
        const sanitizedLine = line.replace(/[()]/g, '');
        const start = sanitizedLine.indexOf(startMarker);

        if (start !== -1) {
          const end = sanitizedLine.indexOf(' ', start);
          errorCode =
            end === -1
              ? sanitizedLine.slice(start + 1)
              : sanitizedLine.slice(start + 1, end);
          return true;
        }

        return false;
      });

      return errorCode;
    };

    const addErrorMsg = (errorCode: string, contract: ContractName) => {
      if (errorCode && contractErrorCodes[contract][errorCode]) {
        message = `${splitCamelCase(
          contractErrorCodes[contract][errorCode]!
        )} - ${message}`;
      }
    };

    if (
      contractName &&
      typeof err === 'string' &&
      err.includes('Error(Contract')
    ) {
      const errorCode = getErrorCode(err);
      if (errorCode) {
        addErrorMsg(errorCode, contractName);
      }
    }

    const newNoti = {
      title: TxnResponse.Error,
      message,
      type: TxnResponse.Error,
      timestamp: Date.now(),
    };

    get().addTxnNotification(newNoti);
  },
  getWallet: async () => {
    // wallet is automatically injected to the window, we just need to get the values

    try {
      const connected = await isConnected();
      const publicKey = await getPublicKey();
      if (!publicKey || !connected) {
        get().addTxnNotification({
          title: 'Please install Freighter Wallet',
          message: 'You need to install Freighter Wallet to continue',
          type: TxnResponse.Error,
          timestamp: Date.now(),
        });
      }
      const networkDetails = await getNetworkDetails();

      const nativeBalance = await get().fetchNativeTokenBalance(
        publicKey,
        (err) => {
          throw new Error(err);
        }
      );

      const wallet: WalletAccount = {
        isConnected: connected,
        network: networkDetails.network,
        networkPassphrase: networkDetails.networkPassphrase,
        publicKey,
        networkUrl: networkDetails.networkUrl,
        nativeTokenBalance: nativeBalance
          ? BigNumber(nativeBalance).multipliedBy(XLM_UNITS)
          : BigNumber(0),
      };
      set({ currentWalletAccount: wallet });
    } catch (ex) {
      // eslint-disable-next-line
      console.error(ex);
    }
  },
  addTxnNotification: (newNotification) => {
    const oldTxnNotis = get().txnNotifications;
    // add the new noti to first index because we will start displaying notis from the last index
    const newNotis = [newNotification, ...oldTxnNotis];
    set({ txnNotifications: newNotis });
  },
  removeTxnNotification: () => {
    // first in first out
    const currentTxnNotis = get().txnNotifications;
    const newNotis = currentTxnNotis.slice(0, -1);
    set({ txnNotifications: newNotis });
  },
  handleTxnSuccessNotification(txnResponse, successMsg, txnHash?) {
    // we don't turn off txnIsProcessing here
    if (txnResponse.status !== 'SUCCESS') {
      return;
    }

    const noti = {
      title: TxnResponse.Success,
      message: successMsg,
      type: TxnResponse.Success,
      timestamp: Date.now(),
      txnHash,
    };

    get().addTxnNotification(noti);
  },
  fetchNativeTokenBalance: async (
    publicKey: string,
    onError?: (error: any) => void
  ) => {
    try {
      const server = new StellarSdk.Server(
        'https://horizon-futurenet.stellar.org/'
      );

      let account;

      const accountErrorMessage = `We're unable to locate your account or it may not have been funded yet.`;

      try {
        account = await server.loadAccount(publicKey);
        if (!account.accountId()) {
          get().handleErrors(accountErrorMessage);
          return;
        }
      } catch (ex) {
        throw new Error(accountErrorMessage);
      }

      const nativeBalance = account.balances.filter((balance: any) => {
        return balance.asset_type === 'native';
      })[0]?.balance;
      return nativeBalance;
    } catch (err) {
      get().handleErrors(err);
      if (onError) {
        onError(err);
      }
      return null;
    }
  },

  updateIsTxnProcessing: (isProcessing: boolean) => {
    set({ isTxnProcessing: isProcessing });
  },
  updateMultisigAccounts: (accounts: MultiCliqueAccount[]) => {
    set({ multisigAccounts: accounts });
  },
  updateMultisigTransactions: (transactions: MultisigTransaction[]) => {
    set({ multisigTransactions: transactions });
  },
  fetchConfig: async () => {
    try {
      const config = await getConfig();
      set({ elioConfig: config });
    } catch (err) {
      get().handleErrors('Error fetching config', err);
    }
  },
  updateJwt: (jwt: JwtToken | null) => {
    set({ jwt });
  },
  pages: {
    ...createAccountSlice(set, get, store),
  },
}));

export default useMCStore;
