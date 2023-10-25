import {
  BASE_FEE,
  NETWORK,
  NETWORK_PASSPHRASE,
  SERVICE_URL,
} from '@/config/index';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import { AccountService, JwtService, TransactionService } from '@/services';
import type { ContractName } from '@/stores/MCStore';
import useMCStore, { TxnResponse } from '@/stores/MCStore';
import type { JwtToken } from '@/types/auth';
import type { MultiCliqueAccount } from '@/types/multiCliqueAccount';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import {
  accountToScVal,
  decodeXdr,
  isValidXDR,
  numberToU32ScVal,
  toBase64,
  toScValBytes,
} from '@/utils';
import { signBlob, signTransaction } from '@stellar/freighter-api';
import * as SorobanClient from 'soroban-client';

export enum TxnStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

const useMC = () => {
  const [
    currentWalletAccount,
    sorobanServer,
    updateIsTxnProcessing,
    handleErrors,
    handleTxnSuccessNotification,
    MCConfig,
    updateJwt,
    jwt,
    addTxnNotification,
  ] = useMCStore((s) => [
    s.currentWalletAccount,
    s.sorobanServer,
    s.updateIsTxnProcessing,
    s.handleErrors,
    s.handleTxnSuccessNotification,
    s.MCConfig,
    s.updateJwt,
    s.jwt,
    s.addTxnNotification,
  ]);

  const loadingModal = useLoadingScreenContext();

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
        console.log(txResponse);
        updateIsTxnProcessing(false);
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
    unpreparedTxn:
      | SorobanClient.Transaction<
          SorobanClient.Memo<SorobanClient.MemoType>,
          SorobanClient.Operation[]
        >
      | SorobanClient.FeeBumpTransaction,
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
    unpreparedTxn:
      | SorobanClient.Transaction<
          SorobanClient.Memo<SorobanClient.MemoType>,
          SorobanClient.Operation[]
        >
      | SorobanClient.FeeBumpTransaction,
    successMsg: string,
    errorMsg: string,
    contractName: ContractName | 'none', // add contract name for handle error code
    onComplete?: Function,
    onError?: Function
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
        currentWalletAccount!.publicKey
      );
      const txResponse = await sendTxn(signedTxn, MCConfig.networkPassphrase);
      return await handleTxnResponse(
        txResponse,
        successMsg,
        errorMsg,
        onComplete
      );
    } catch (err) {
      if (onError) {
        onError();
      }
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
  const doChallenge = async (mcAccountAddress: string) => {
    try {
      const challengeRes = await fetch(
        `${SERVICE_URL}/multiclique/accounts/${mcAccountAddress}/challenge/`
      );
      const { challenge } = await challengeRes.json();

      if (!challenge) {
        handleErrors('Error in retrieving ownership-validation challenge');
        return null;
      }
      const signerResult = await signBlob(toBase64(challenge), {
        accountToSign: currentWalletAccount?.publicKey,
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

  const getJwtToken = async (mcAccountAddress: string) => {
    try {
      const sig = await doChallenge(mcAccountAddress);
      if (!sig) {
        return null;
      }
      let refreshedToken: JwtToken;
      if (jwt) {
        refreshedToken = await JwtService.refreshJWT(mcAccountAddress, {
          access: jwt.access,
          refresh: jwt.refresh,
        });
      } else {
        const token = await JwtService.createJWT(mcAccountAddress, {
          signature: sig,
        });
        refreshedToken = await JwtService.refreshJWT(mcAccountAddress, {
          access: token.access,
          refresh: token.refresh,
        });
      }
      updateJwt(refreshedToken);
      return refreshedToken;
    } catch (err) {
      handleErrors('Error in getting jwt token', err);
      return null;
    }
  };

  /**
   *
   * @param preimageHash
   * @returns base 64 preimage hash
   */
  const signPreimageHash = async (preimageHash: string) => {
    const signedHash = await signBlob(preimageHash, {
      accountToSign: currentWalletAccount?.publicKey,
    });

    return toBase64(signedHash);
  };

  const makeCoreInstallationTxn = async () => {
    if (!currentWalletAccount) {
      return;
    }
    try {
      const response = await fetch(
        'https://service.elio-dao.org/multiclique/contracts/create-multiclique-xdr/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_account_address: currentWalletAccount.publicKey,
          }),
        }
      );
      const data = await response.json();
      return data.xdr;
    } catch (err) {
      handleErrors('Error in getting multiclique core contract address', err);
      return null;
    }
  };

  const makePolicyInstallationTxn = async () => {
    if (!currentWalletAccount) {
      return;
    }
    try {
      const response = await fetch(
        'https://service.elio-dao.org/multiclique/contracts/create-policy-xdr/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_account_address: currentWalletAccount.publicKey,
            policy_preset: 'ELIO_DAO',
          }),
        }
      );
      const data = await response.json();
      return data.xdr;
    } catch (err) {
      handleErrors('Error in getting multiclique policy contract address', err);
      return null;
    }
  };

  const installCoreContract = async (cb?: {
    onStart?: Function;
    onCoreInstallationComplete?: Function;
    onComplete?: Function;
    onError?: Function;
  }) => {
    const { onStart, onCoreInstallationComplete, onComplete, onError } =
      cb || {};
    if (!currentWalletAccount) {
      return;
    }
    try {
      if (onStart) {
        onStart();
      }
      const coreXdr = await makeCoreInstallationTxn();

      const txn = new SorobanClient.Transaction(
        coreXdr,
        MCConfig.networkPassphrase
      );
      const coreResult = await submitTxn(
        txn,
        'Multiclique core contract installed',
        'Error in Multiclique core contract installation',
        'multicliqueCore'
      );
      if (!coreResult || coreResult.status === 'FAILED') {
        if (onError) {
          onError();
        }
        throw new Error('Cannot get multiclique core address');
      }
      if (onCoreInstallationComplete) {
        onCoreInstallationComplete();
      }
      const coreId = coreResult.resultMetaXdr
        .v3()
        ?.sorobanMeta()
        ?.returnValue()
        .address()
        .contractId();
      if (!coreId) {
        if (onError) {
          onError();
        }
        throw new Error('Cannot decode policyId');
      }
      const coreContractAddress = SorobanClient.StrKey.encodeContract(coreId);
      if (onComplete) {
        onComplete(coreContractAddress);
      }
      return coreContractAddress;
    } catch (err) {
      if (onError) {
        onError();
      }
      handleErrors('Error in installing Multiclique core contract', err);
      return null;
    }
  };

  const installPolicyContract = async (cb?: {
    onComplete?: Function;
    onError?: Function;
  }) => {
    const { onComplete, onError } = cb || {};
    if (!currentWalletAccount) {
      return;
    }
    try {
      const coreXdr = await makePolicyInstallationTxn();

      const txn = new SorobanClient.Transaction(
        coreXdr,
        MCConfig.networkPassphrase
      );
      const policyResult = await submitTxn(
        txn,
        'Multiclique core contract installed',
        'Error in Multiclique core contract installation',
        'multicliqueCore'
      );
      if (!policyResult || policyResult.status === 'FAILED') {
        throw new Error('Cannot get multiclique policy address');
      }
      const policyId = policyResult.resultMetaXdr
        .v3()
        ?.sorobanMeta()
        ?.returnValue()
        .address()
        .contractId();

      if (!policyId) {
        throw new Error('Cannot decode policyId');
      }
      const policyContractAddress =
        SorobanClient.StrKey.encodeContract(policyId);
      if (onComplete) {
        await onComplete(policyContractAddress);
      }
      return policyContractAddress;
    } catch (err) {
      if (onError) {
        onError();
      }
      handleErrors('Error in installing Multiclique core contract', err);
      return null;
    }
  };

  const initMulticliqueCore = async (
    coreAddress: string,
    signerAddresses: string[],
    threshold: number,
    cb?: {
      onComplete?: Function;
      onError?: Function;
    }
  ) => {
    const { onComplete, onError } = cb || {};
    if (!currentWalletAccount) {
      return;
    }

    const rawKeys = signerAddresses.map((addy) => {
      return SorobanClient.Keypair.fromPublicKey(addy).rawPublicKey();
    });

    const coreContract = new SorobanClient.Contract(coreAddress);
    const txnBuilder = await getTxnBuilder(currentWalletAccount?.publicKey);
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
      onComplete,
      onError
    );
  };

  const initMulticliquePolicy = async (
    policyAddress: string,
    contracts: {
      multiclique: string;
      elioCore: string;
      elioVotes: string;
      elioAssets: string;
    },
    cb?: {
      onComplete?: Function;
      onError?: Function;
    }
  ) => {
    const { onComplete, onError } = cb || {};
    if (!currentWalletAccount) {
      return;
    }

    const tx = await makeContractTxn(
      currentWalletAccount.publicKey,
      policyAddress,
      'init',
      ...Object.values(contracts).map((v) => accountToScVal(v))
    );

    await submitTxn(
      tx,
      'Initialized Multiclique policy',
      'Error in initializing Multiclique policy',
      'multicliquePolicy',
      onComplete,
      onError
    );
  };

  const createMultisigDB = async (
    payload: MultiCliqueAccount,
    cb?: Function
  ) => {
    try {
      const response = await AccountService.createMultiCliqueAccount(payload);
      if (cb) cb(response);
      return response;
    } catch (err) {
      handleErrors('Error in getting creating multiclique account', err);
      return null;
    }
  };

  const makeAttachPolicyTxn = async (
    coreContract: string,
    policyAddress: string,
    contractAddresses: string[]
  ) => {
    if (!currentWalletAccount?.publicKey) {
      return;
    }
    const txn = await makeContractTxn(
      currentWalletAccount?.publicKey,
      coreContract,
      'attach_policy',
      accountToScVal(policyAddress),
      SorobanClient.xdr.ScVal.scvVec(
        contractAddresses.map((v) => accountToScVal(v))
      )
    );

    return txn;
  };

  const makeAddSignerTxn = async (
    coreAddress: string,
    signerAddress: string
  ) => {
    if (!currentWalletAccount?.publicKey) {
      return;
    }
    const txn = await makeContractTxn(
      currentWalletAccount?.publicKey,
      coreAddress,
      'add_signer',
      toScValBytes(signerAddress)
    );
    return txn;
  };

  const makeRemoveSignerTxn = async (
    coreAddress: string,
    signerAddress: string
  ) => {
    if (!currentWalletAccount?.publicKey) {
      return;
    }
    const txn = await makeContractTxn(
      currentWalletAccount?.publicKey,
      coreAddress,
      'remove_signer',
      toScValBytes(signerAddress)
    );
    return txn;
  };

  const makeChangeThresholdTxn = async (
    coreAddress: string,
    newThreshold: number
  ) => {
    if (!currentWalletAccount?.publicKey) {
      return;
    }
    const txn = await makeContractTxn(
      currentWalletAccount?.publicKey,
      coreAddress,
      'set_default_threshold',
      numberToU32ScVal(newThreshold)
    );
    return txn;
  };

  const createMCTransactionDB = async (xdr: string, jwtToken: JwtToken) => {
    if (!currentWalletAccount) {
      return;
    }

    if (!isValidXDR(xdr.trim().toString(), MCConfig.networkPassphrase)) {
      handleErrors('Invalid XDR');
      return null;
    }

    try {
      loadingModal.setAction({
        type: 'SHOW_TRANSACTION_PROCESSING',
      });

      const mcTxnRes = await TransactionService.createMultiCliqueTransaction(
        {
          xdr: xdr.trim().toString(),
        },
        jwtToken
      );

      if (!mcTxnRes?.preimageHash) {
        throw new Error('Error creating a Multiclique Transaction');
      }

      const newHash = await signPreimageHash(mcTxnRes.preimageHash);

      const updatedTxn = await TransactionService.patchMultiCliqueTransaction(
        mcTxnRes.id.toString(),
        {
          approvals: [
            {
              signatory: {
                name: currentWalletAccount.publicKey,
                address: currentWalletAccount.publicKey,
              },
              signature: newHash,
            },
          ],
        },
        jwtToken
      );

      return updatedTxn;
    } catch (err) {
      handleErrors('Error in creating multiclique offchain transaction ', err);
      return null;
    }
  };
  // eslint-disable-next-line
  const approveTxnDB = async (txn: MultisigTransaction, jwt: JwtToken) => {
    if (!currentWalletAccount) {
      return;
    }

    try {
      const newHash = await signPreimageHash(txn.preimageHash);
      const updatedTxn = await TransactionService.patchMultiCliqueTransaction(
        txn.id.toString(),
        {
          approvals: [
            {
              signatory: {
                name: currentWalletAccount.publicKey,
                address: currentWalletAccount.publicKey,
              },
              signature: newHash,
            },
          ],
        },
        jwt
      );

      if (updatedTxn?.approvals?.length) {
        addTxnNotification({
          title: 'Multiclique transaction approved',
          message: '',
          timestamp: Date.now(),
          type: TxnResponse.Success,
        });
      }
    } catch (err) {
      handleErrors('Error in approving multiclique offchain transaction ', err);
    }
  };
  // eslint-disable-next-line
  const rejectTxnDB = async (txn: MultisigTransaction, jwt: JwtToken) => {
    if (!currentWalletAccount) {
      return;
    }

    try {
      const newHash = await signPreimageHash(txn.preimageHash);
      const updatedTxn = await TransactionService.patchMultiCliqueTransaction(
        txn.id.toString(),
        {
          rejections: [
            {
              signatory: {
                name: currentWalletAccount.publicKey,
                address: currentWalletAccount.publicKey,
              },
              signature: newHash,
            },
          ],
        },
        jwt
      );
      if (updatedTxn?.rejections?.length) {
        addTxnNotification({
          title: 'Multiclique transaction approved',
          message: '',
          timestamp: Date.now(),
          type: TxnResponse.Success,
        });
      }
    } catch (err) {
      handleErrors('Error in approving multiclique offchain transaction ', err);
    }
  };

  const executeMCTxn = async (txn: MultisigTransaction) => {
    if (!currentWalletAccount) {
      return;
    }

    const transaction = SorobanClient.TransactionBuilder.fromXDR(
      txn.xdr,
      MCConfig?.networkPassphrase
    );
    await submitTxn(
      transaction,
      'Multiclique transaction executed',
      'Error in executing multiclique transaction',
      'multicliqueCore'
    );
  };

  return {
    handleTxnResponse,
    initMulticliqueCore,
    makeContractTxn,
    submitReadTxn,
    submitTxn,
    doChallenge,
    createMultisigDB,
    makeAttachPolicyTxn,
    initMulticliquePolicy,
    installCoreContract,
    installPolicyContract,
    makeAddSignerTxn,
    makeRemoveSignerTxn,
    signTxn,
    sendTxn,
    prepareTxn,
    getTxnBuilder,
    getJwtToken,
    makeChangeThresholdTxn,
    createMCTransactionDB,
    approveTxnDB,
    rejectTxnDB,
    executeMCTxn,
  };
};

export default useMC;
