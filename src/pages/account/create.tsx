import ConnectWallet from '@/components/ConnectWallet';
import type { ICreateMultisigFormProps } from '@/components/CreateMultisigForm';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import useMC from '@/hooks/useMC';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import { useLoadingScreenContext } from '../../context/LoadingScreen/index';

const Create = () => {
  const [
    currentAccount,
    handleErrors,
    elioConfig,
    updateIsTxProcessing,
    updateMultisigAccounts,
    multisigAccounts,
  ] = useMCStore((s) => [
    s.currentAccount,
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
    if (!currentAccount || !elioConfig) return;

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

    try {
      useLoadingScreen.setAction({
        type: 'SHOW_SIGNATURE',
        payload: {
          totalSignCount: 4,
          currentSignCount: 1,
        },
      });

      await installCoreContract(async (coreAddress: string) => {
        useLoadingScreen.setAction({
          type: 'SHOW_SIGNATURE',
          payload: {
            totalSignCount: 4,
            currentSignCount: 2,
          },
        });

        await initMulticliqueCore(
          coreAddress,
          signerAddresses,
          threshold,
          async () => {
            useLoadingScreen.setAction({
              type: 'SHOW_SIGNATURE',
              payload: {
                totalSignCount: 4,
                currentSignCount: 3,
              },
            });

            await installPolicyContract((policyAddress: string) => {
              initMulticliquePolicy(
                policyAddress,
                {
                  multiclique: coreAddress,
                  elioCore: elioConfig?.coreContractAddress,
                  elioVotes: elioConfig?.votesContractAddress,
                  elioAssets: elioConfig?.votesContractAddress,
                },
                async () => {
                  useLoadingScreen.setAction({
                    type: 'CLOSE',
                    payload: {
                      isComplete: true,
                    },
                  });
                  const multisigPayload = {
                    name: data.accountName,
                    address: coreAddress,
                    signatories: [creatorSignatory, ...signatories],
                    defaultThreshold: threshold,
                    policy: 'ELIO_DAO',
                  };
                  const multisig = await createMultisigDB(multisigPayload);
                  if (multisig) {
                    updateMultisigAccounts([multisig, ...multisigAccounts]);
                  }
                  updateIsTxProcessing(false);
                  router.push(`/`);
                }
              );
            });
          }
        );
      });
    } catch (error) {
      handleErrors('Error in creating MultiClique Account', error);
      updateIsTxProcessing(false);
      useLoadingScreen.setAction({
        type: 'CLOSE',
        payload: {
          isComplete: true,
        },
      });
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
            {currentAccount?.isConnected ? (
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
