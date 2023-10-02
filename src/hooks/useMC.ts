import {
  BASE_FEE,
  NETWORK,
  NETWORK_PASSPHRASE,
  SERVICE_URL,
} from '@/config/index';
import { AccountService } from '@/services';
import type { ContractName } from '@/stores/MCStore';
import useMCStore from '@/stores/MCStore';
import type { Multisig } from '@/types/multisig';
import { accountToScVal, decodeXdr, numberToU32ScVal, toBase64 } from '@/utils';
import { signBlob, signTransaction } from '@stellar/freighter-api';
import * as SorobanClient from 'soroban-client';

export enum TxnStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

const useMC = () => {
  const [
    currentAccount,
    sorobanServer,
    updateIsTxnProcessing,
    handleErrors,
    handleTxnSuccessNotification,
    MCConfig,
  ] = useMCStore((s) => [
    s.currentAccount,
    s.sorobanServer,
    s.updateIsTxnProcessing,
    s.handleErrors,
    s.handleTxnSuccessNotification,
    s.MCConfig,
  ]);

  const handleTxnResponse = async (
    sendTxnResponse: SorobanClient.SorobanRpc.SendTransactionResponse,
    successMsg: string,
    errorMsg: string,
    cb?: Function
  ) => {
    if (sendTxnResponse.errorResultXdr) {
      // eslint-disable-next-line
      console.log(
        `ERROR: Cannot send transaction`,
        sendTxnResponse.errorResultXdr
      );
    }

    if (sendTxnResponse.status === 'PENDING') {
      // eslint-disable-next-line
      let txResponse = await sorobanServer.getTransaction(sendTxnResponse.hash);
      // let event = await sorobanServer.getEvents()
      while (txResponse.status === 'NOT_FOUND') {
        // eslint-disable-next-line
        txResponse = await sorobanServer.getTransaction(sendTxnResponse.hash);
        // eslint-disable-next-line
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (txResponse.status === 'FAILED') {
        // eslint-disable-next-line
        console.log(txResponse.status);
        updateIsTxnProcessing(false); // delay here and pass onto the next state controller
        handleErrors(errorMsg);
      }

      if (txResponse.status === 'SUCCESS') {
        handleTxnSuccessNotification(
          txResponse,
          successMsg,
          sendTxnResponse.hash
        );
        // turn off processing state when there's no more next steps
        if (cb) {
          cb(txResponse);
        } else {
          updateIsTxnProcessing(false);
        }
      }

      return txResponse;
      // eslint-disable-next-line no-else-return
    } else {
      // handle error here
      handleErrors(
        `Unabled to submit transaction, status: ${sendTxnResponse.status}`
      );
      return null;
    }
  };

  const prepareTxn = async (
    unpreparedTxn: SorobanClient.Transaction<
      SorobanClient.Memo<SorobanClient.MemoType>
    >,
    networkPassphraseStr: string,
    contractName: ContractName | 'none'
  ) => {
    try {
      const preparedTxn = await sorobanServer.prepareTransaction(
        unpreparedTxn,
        networkPassphraseStr
      );
      return preparedTxn.toXDR();
    } catch (err) {
      handleErrors(
        'Cannot prepare transaction:',
        err,
        contractName === 'none' ? undefined : contractName
      );
      return null;
    }
  };

  const getTxnBuilder = async (
    publicKey: string
  ): Promise<SorobanClient.TransactionBuilder> => {
    const sourceAccount = await sorobanServer.getAccount(publicKey);
    return new SorobanClient.TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase:
        MCConfig?.networkPassphrase || NETWORK_PASSPHRASE[NETWORK],
    });
  };

  const signTxn = async (
    xdr: string,
    networkPassphraseStr: string,
    accountToSign: string
  ) => {
    const signedResponse = await signTransaction(xdr, {
      networkPassphrase: networkPassphraseStr,
      accountToSign,
    });
    return signedResponse;
  };

  const sendTxn = async (signedXDR: string, networkPassphraseStr: string) => {
    const tx = SorobanClient.TransactionBuilder.fromXDR(
      signedXDR,
      networkPassphraseStr
    );
    const sendResponse = await sorobanServer.sendTransaction(tx);
    return sendResponse;
  };

  /** Use this to submit a transaction */
  const submitTxn = async (
    unpreparedTxn: SorobanClient.Transaction<
      SorobanClient.Memo<SorobanClient.MemoType>
    >,
    successMsg: string,
    errorMsg: string,
    contractName: ContractName | 'none', // add contract name for handle error code
    cb?: Function
  ) => {
    if (!MCConfig) {
      handleErrors('Cannot fetch contract addresses');
      return;
    }
    updateIsTxnProcessing(true);
    try {
      // eslint-disable-next-line
      console.log('Unprepared txn', unpreparedTxn.toXDR());
      const preparedTxn = await prepareTxn(
        unpreparedTxn,
        MCConfig.networkPassphrase,
        contractName
      );
      if (!preparedTxn) {
        return;
      }
      const signedTxn = await signTxn(
        preparedTxn,
        MCConfig.networkPassphrase,
        currentAccount!.publicKey
      );
      const txResponse = await sendTxn(signedTxn, MCConfig.networkPassphrase);
      return await handleTxnResponse(txResponse, successMsg, errorMsg, cb);
    } catch (err) {
      handleErrors('Send Transaction failed', err);
      return null;
    }
  };

  /** Submit a transaction to read on-chain info */
  const submitReadTxn = async (
    txn: SorobanClient.Transaction<SorobanClient.Memo<SorobanClient.MemoType>>
  ) => {
    try {
      // eslint-disable-next-line
      console.log('Stimulating transaction...');
      const resObj = (await sorobanServer.simulateTransaction(
        txn
      )) as SorobanClient.SorobanRpc.SimulateTransactionResponse;

      let response: SorobanClient.SorobanRpc.SimulateTransactionResponse;

      if (Object.keys(resObj).includes('error')) {
        response =
          resObj as SorobanClient.SorobanRpc.SimulateTransactionErrorResponse;
        throw new Error(response.error);
      } else if (Object.keys(resObj).includes('transactionData')) {
        response =
          resObj as unknown as SorobanClient.SorobanRpc.SimulateTransactionSuccessResponse;
        if (response?.result) {
          return decodeXdr(response.result.retval.toXDR().toString('base64'));
        }
        return null;
      } else {
        response =
          resObj as SorobanClient.SorobanRpc.SimulateTransactionRestoreResponse;
        if (response?.result) {
          return decodeXdr(response.result.retval.toXDR().toString('base64'));
        }
      }
    } catch (err) {
      handleErrors('Cannot submit read transaction', err);
      return null;
    }
  };

  const makeContractTxn = async (
    sourcePublicKey: string,
    contractAddress: string,
    method: string,
    ...params: SorobanClient.xdr.ScVal[]
  ): Promise<SorobanClient.Transaction> => {
    const contract = new SorobanClient.Contract(contractAddress);
    const txn = new SorobanClient.TransactionBuilder(
      await sorobanServer.getAccount(sourcePublicKey),
      {
        fee: BASE_FEE,
        networkPassphrase: MCConfig?.networkPassphrase,
      }
    )
      .addOperation(contract.call(method, ...params))
      .setTimeout(0)
      .build();

    return txn;
  };

  /**
   * Authenticate users access to post request
   */
  const doChallenge = async (daoId: string) => {
    try {
      const challengeRes = await fetch(
        `${SERVICE_URL}/daos/${daoId}/challenge/`
      );
      const { challenge } = await challengeRes.json();

      if (!challenge) {
        handleErrors('Error in retrieving ownership-validation challenge');
        return null;
      }
      const signerResult = await signBlob(toBase64(challenge), {
        accountToSign: currentAccount?.publicKey,
      });

      if (!signerResult) {
        handleErrors('Not able to validate ownership');
        return null;
      }

      return toBase64(signerResult);
    } catch (err) {
      handleErrors(err);
      return null;
    }
  };

  /**
   *
   * @param policyData source is the caller's address
   * @returns
   */
  const makeInstallMulticliqueTxns = async (policyData: {
    source: string;
    policy_preset: string;
  }) => {
    try {
      const response = await fetch(
        'https://service.elio-dao.org/multiclique/accounts/install',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(policyData),
        }
      );
      const data = await response.json();
      const coreXdr = data.core_xdr;
      const policyXdr = data.policy_xdr;
      return {
        coreTransaction: new SorobanClient.Transaction(
          coreXdr,
          MCConfig.networkPassphrase
        ),
        policyTransaction: new SorobanClient.Transaction(
          policyXdr,
          MCConfig.networkPassphrase
        ),
      };
    } catch (err) {
      handleErrors('Error in installing Multiclique policy', err);
      return null;
    }
  };

  const getMulticliqueAddresses = async (
    policyData: {
      source: string;
      policy_preset: string;
    },
    cb?: Function
  ) => {
    let contractAddresses:
      | {
          coreAddress?: string;
          policyAddress?: string;
        }
      | undefined;
    try {
      const txns = await makeInstallMulticliqueTxns(policyData);

      if (!txns) {
        return;
      }

      let policyResult: any;

      const coreResult = await submitTxn(
        txns.coreTransaction,
        'Multiclique core contract installed',
        'Error in Multiclique core contract installation',
        'multicliqueCore',
        async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          policyResult = await submitTxn(
            txns.policyTransaction,
            'Multiclique policy contract installed',
            'Error in Multiclique policy installation',
            'multicliquePolicy',
            async () => {
              await new Promise((resolve) => {
                setTimeout(resolve, 2000);
              });
              if (!coreResult || coreResult.status === 'FAILED') {
                throw new Error('Cannot get multiclique core address');
              }

              if (!policyResult || policyResult.stats === 'FAILED') {
                throw new Error('Cannot get multiclique policy address');
              }

              const coreId = coreResult.resultMetaXdr
                .v3()
                ?.sorobanMeta()
                ?.returnValue()
                .address()
                .contractId();

              const policyId = policyResult.resultMetaXdr
                .v3()
                ?.sorobanMeta()
                ?.returnValue()
                .address()
                .contractId();

              if (!coreId) {
                throw new Error('Cannot decode coreId');
              }

              if (!policyId) {
                throw new Error('Cannot decode policyId');
              }

              contractAddresses = {
                coreAddress: SorobanClient.StrKey.encodeContract(coreId),
                policyAddress: SorobanClient.StrKey.encodeContract(policyId),
              };
              // eslint-disable-next-line
              console.log('contract addresses', contractAddresses)
              if (cb) {
                cb(contractAddresses);
              }

              return contractAddresses;
            }
          );
        }
      );
      return contractAddresses;
    } catch (err) {
      handleErrors('Error in getting multiclique addresses', err);
      return null;
    }
  };

  const initMulticliqueCore = async (
    contractAddresses: {
      coreAddress: string;
      policyAddress: string;
    },
    signerAddresses: string[],
    threshold: number,
    cb: Function
  ) => {
    if (!currentAccount) {
      return;
    }

    const rawKeys = signerAddresses.map((addy) => {
      return SorobanClient.Keypair.fromPublicKey(addy).rawPublicKey();
    });

    const coreContract = new SorobanClient.Contract(
      contractAddresses.coreAddress
    );
    const txnBuilder = await getTxnBuilder(currentAccount?.publicKey);
    const txn = txnBuilder
      .addOperation(
        coreContract.call(
          'init',
          SorobanClient.nativeToScVal(rawKeys),
          numberToU32ScVal(threshold)
        )
      )
      .setTimeout(0)
      .build();

    await submitTxn(
      txn,
      'Initialized Multiclique ',
      'Error in initializing Multiclique',
      'multicliqueCore',
      cb
    );
  };

  const initMulticliquePolicy = async (
    policyAddress: string,
    contracts: {
      multiclique: string;
      elioCore: string;
      elioVotes: string;
      elioAssets: string;
    }
  ) => {
    if (!currentAccount) {
      return;
    }

    const tx = await makeContractTxn(
      currentAccount.publicKey,
      policyAddress,
      'init',
      ...Object.values(contracts).map((v) => accountToScVal(v))
    );

    await submitTxn(
      tx,
      'Initialized Multiclique policy',
      'Error in initializing Multiclique policy',
      'multicliquePolicy'
    );
  };

  const createMultisigDB = async (payload: Multisig, cb?: Function) => {
    try {
      const response = await AccountService.createMultiCliqueAccount(payload);
      if (cb) cb(response);
      return response;
    } catch (err) {
      handleErrors('Error in getting creating multiclique account', err);
      return null;
    }
  };

  const attachPolicy = async (
    coreContract: string,
    policyAddress: string,
    contractAddresses: string[],
    cb: Function
  ) => {
    if (!currentAccount?.publicKey) {
      return;
    }
    const txn = await makeContractTxn(
      currentAccount?.publicKey,
      coreContract,
      'attach_policy',

      accountToScVal(policyAddress),
      SorobanClient.xdr.ScVal.scvVec(
        contractAddresses.map((v) => accountToScVal(v))
      )
    );
    await submitTxn(
      txn,
      'Attached Multiclique policy',
      'Error in attaching Multiclique policy',
      'multicliqueCore',
      cb
    );
  };

  return {
    handleTxnResponse,
    getMulticliqueAddresses,
    initMulticliqueCore,
    makeContractTxn,
    submitReadTxn,
    submitTxn,
    doChallenge,
    createMultisigDB,
    attachPolicy,
    initMulticliquePolicy,
  };
};

export default useMC;
