import ConnectWallet from '@/components/ConnectWallet';
import type { ICreateMultisigFormProps } from '@/components/CreateMultisigForm';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import useMC from '@/hooks/useMC';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import type { MultiCliqueAccount } from '@/types/multiCliqueAccount';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import { useLoadingScreenContext } from '../../context/LoadingScreen/index';

const Create = () => {
  const [
    currentWalletAccount,
    handleErrors,
    elioConfig,
    updateIsTxProcessing,
    updateMultisigAccounts,
    multisigAccounts,
  ] = useMCStore((s) => [
    s.currentWalletAccount,
    s.handleErrors,
    s.elioConfig,
    s.updateIsTxnProcessing,
    s.updateMultisigAccounts,
    s.multisigAccounts,
  ]);

  const router = useRouter();

  const useLoadingScreen = useLoadingScreenContext();

  const {
    initMulticliqueCore,
    initMulticliquePolicy,
    createMultisigDB,
    installCoreContract,
    installPolicyContract,
  } = useMC();

  const onSubmit: SubmitHandler<ICreateMultisigFormProps> = async (data) => {
    if (!currentWalletAccount || !elioConfig) return;

    const { creatorName, creatorAddress, signatories, threshold } = data;

    const creatorSignatory = {
      name: creatorName,
      address: creatorAddress,
    };

    const signerAddresses = [
      creatorAddress,
      ...(signatories
        ?.filter((signer) => signer != null)
        .map((signer) => signer.address) ?? []),
    ];

    const onError = () => {
      updateIsTxProcessing(false);
      useLoadingScreen.setAction({
        type: 'CLOSE',
      });
    };

    const handleUpdateDatabase = async (
      policyAddress: string,
      coreAddress: string
    ) => {
      const multisigPayload: MultiCliqueAccount = {
        name: data.accountName,
        address: coreAddress,
        signatories: [creatorSignatory, ...signatories],
        defaultThreshold: threshold,
        policy: {
          address: policyAddress,
          name: 'ELIO_DAO',
        },
      };
      const multisig = await createMultisigDB(multisigPayload);
      if (multisig) {
        updateMultisigAccounts([multisig, ...multisigAccounts]);
      }
      updateIsTxProcessing(false);
      useLoadingScreen.setAction({
        type: 'CLOSE',
      });
      router.push(`/`);
    };

    const handleInstallMulticliquePolicy = async (
      policyAddress: string,
      coreAddress: string
    ) => {
      await initMulticliquePolicy(
        policyAddress,
        {
          multiclique: coreAddress,
          elioCore: elioConfig?.coreContractAddress,
          elioVotes: elioConfig?.votesContractAddress,
          elioAssets: elioConfig?.votesContractAddress,
        },
        {
          onComplete: () => handleUpdateDatabase(policyAddress, coreAddress),
          onError,
        }
      );
    };

    const handleInstallPolicyContract = async (coreAddress: string) => {
      await installPolicyContract({
        onComplete: (policyAddress: string) => {
          useLoadingScreen.setAction({
            type: 'SHOW_SIGNATURE',
            payload: {
              totalSignCount: 4,
              currentSignCount: 4,
            },
          });
          handleInstallMulticliquePolicy(policyAddress, coreAddress);
        },
        onError,
      });
    };

    const handleInstallMulticliqueCore = async (coreAddress: string) => {
      await initMulticliqueCore(coreAddress, signerAddresses, threshold, {
        onComplete: () => {
          useLoadingScreen.setAction({
            type: 'SHOW_SIGNATURE',
            payload: {
              totalSignCount: 4,
              currentSignCount: 3,
            },
          });
          handleInstallPolicyContract(coreAddress);
        },
        onError,
      });
    };

    try {
      useLoadingScreen.setAction({
        type: 'SHOW_SIGNATURE',
        payload: {
          totalSignCount: 4,
          currentSignCount: 1,
        },
      });

      await installCoreContract({
        onCoreInstallationComplete: () => {
          useLoadingScreen.setAction({
            type: 'SHOW_SIGNATURE',
            payload: {
              totalSignCount: 4,
              currentSignCount: 2,
            },
          });
        },
        onComplete: handleInstallMulticliqueCore,
        onError,
      });
    } catch (error) {
      onError();
      handleErrors('Error in creating MultiClique Account', error);
    }
  };

  return (
    <MainLayout
      title={'MultiClique - Create Account'}
      description={'Create a new Multisig Account'}>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[950px] overflow-hidden p-4'>
        <div>
          <div className='m-4'>
            <h1>Create new account</h1>
          </div>
          <div>
            {currentWalletAccount?.isConnected ? (
              <CreateMultisigForm onSubmit={onSubmit}>
                <CreateMultisigForm.AccountName />
                <CreateMultisigForm.Signers />
                <CreateMultisigForm.Threshold />
              </CreateMultisigForm>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Create;
