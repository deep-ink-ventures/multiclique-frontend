import BigNumber from 'bignumber.js';

import { splitCamelCase } from '@/utils';
import {
  getNetworkDetails,
  getPublicKey,
  isConnected,
} from '@stellar/freighter-api';
import StellarSdk from 'stellar-sdk';
import { create } from 'zustand';
import { XLM_UNITS } from '../config/index';
import { contractErrorCodes } from './errors';

export interface WalletAccount {
  isConnected: boolean;
  publicKey: string;
  network: string;
  networkUrl: string;
  networkPassphrase: string;
  nativeTokenBalance: BigNumber;
  MCAccounts: string[];
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

export type ContractName =
  | 'core'
  | 'votes'
  | 'assets'
  | 'multicliqueCore'
  | 'multicliquePolicy';

export interface MCState {
  currentAccount: WalletAccount | null;
  txnNotifications: TxnNotification[];
  isTxnProcessing: boolean;
  isConnectModalOpen: boolean;
}

export interface MCActions {
  updateCurrentAccount: (account: WalletAccount | null) => void;
  getWallet: () => void;
  addTxnNotification: (notification: TxnNotification) => void;
  removeTxnNotification: () => void;
  handleErrors: (
    errMsg: string,
    err?: Error,
    contractName?: ContractName
  ) => void;
  fetchNativeTokenBalance: (
    publickey: string
  ) => Promise<string | null | undefined>;
  updateIsConnectModalOpen: (isOpen: boolean) => void;
  fetchMCAccounts: (publickey: string) => Promise<string[] | null | undefined>;
}

export interface MCStore extends MCState, MCActions {}

const useMCStore = create<MCStore>((set, get) => ({
  currentAccount: null,
  txnNotifications: [],
  isTxnProcessing: false,
  isConnectModalOpen: false,
  updateCurrentAccount: (account: WalletAccount | null) => {
    set({ currentAccount: account });
  },
  updateIsConnectModalOpen: (isOpen: boolean) => {
    set({ isConnectModalOpen: isOpen });
  },
  getWallet: async () => {
    // wallet is automatically injected to the window, we just need to get the values

    const connected = await isConnected();
    const networkDetails = await getNetworkDetails();
    const publicKey = await getPublicKey();
    const nativeBalance = await get().fetchNativeTokenBalance(publicKey);
    const MCaccounts = await get().fetchMCAccounts(publicKey);
    const wallet: WalletAccount = {
      isConnected: connected,
      network: networkDetails.network,
      networkPassphrase: networkDetails.networkPassphrase,
      publicKey,
      networkUrl: networkDetails.networkUrl,
      nativeTokenBalance: nativeBalance
        ? BigNumber(nativeBalance).multipliedBy(XLM_UNITS)
        : BigNumber(0),
      MCAccounts: MCaccounts || [],
    };
    set({ currentAccount: wallet });
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
  fetchNativeTokenBalance: async (publicKey: string) => {
    try {
      const server = new StellarSdk.Server(
        'https://horizon-futurenet.stellar.org/'
      );
      const account = await server.loadAccount(publicKey);
      if (!account.accountId()) {
        get().handleErrors('We cannot find your account');
        return;
      }
      const nativeBalance = account.balances.filter((balance: any) => {
        return balance.asset_type === 'native';
      })[0]?.balance;
      return nativeBalance;
    } catch (err) {
      get().handleErrors(err);
      return null;
    }
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
  fetchMCAccounts: async (publicKey: string) => {
    // fixme: this is a placeholder
    if (publicKey) {
      return Promise.resolve([]);
    }
    return Promise.resolve(null);
  },
}));

export default useMCStore;
