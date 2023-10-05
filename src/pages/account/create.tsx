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
    getMulticliqueAddresses,
    initMulticliqueCore,
    initMulticliquePolicy,
    createMultisigDB,
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

    const multicliqueData = {
      source: currentAccount.publicKey,
      policy_preset: 'ELIO_DAO',
    };
    // TODO: if users reject, the loading screen won't disappear
    try {
      useLoadingScreen.setAction({
        type: 'SHOW_SIGNATURE',
        payload: {
          totalSignCount: 4,
          currentSignCount: 1,
        },
      });
      await getMulticliqueAddresses(
        multicliqueData,
        () => {
          useLoadingScreen.setAction({
            type: 'SHOW_SIGNATURE',
            payload: {
              totalSignCount: 4,
              currentSignCount: 2,
            },
          });
        },
        (addresses: { coreAddress: string; policyAddress: string }) => {
          useLoadingScreen.setAction({
            type: 'SHOW_SIGNATURE',
            payload: {
              totalSignCount: 4,
              currentSignCount: 3,
            },
          });
          initMulticliqueCore(addresses, signerAddresses, threshold, () => {
            useLoadingScreen.setAction({
              type: 'SHOW_SIGNATURE',
              payload: {
                isComplete: true,
              },
            });
            initMulticliquePolicy(
              addresses.policyAddress,
              {
                multiclique: addresses.coreAddress,
                elioCore: elioConfig?.coreContractAddress,
                elioVotes: elioConfig?.votesContractAddress,
                elioAssets: elioConfig?.votesContractAddress,
              },
              async () => {
                useLoadingScreen.setAction({
                  type: 'CLOSE',
                });
                const multisigPayload = {
                  name: data.accountName,
                  address: addresses.coreAddress,
                  signatories: [creatorSignatory, ...signatories],
                  defaultThreshold: threshold,
                  policy: 'ELIO_DAO',
                };
                const multisig = await createMultisigDB(multisigPayload);
                if (multisig) {
                  updateMultisigAccounts([multisig, ...multisigAccounts]);
                }
                updateIsTxProcessing(false);
                // route to the index page
                router.push(`/`);
              }
            );
          });
        }
      );
    } catch (error) {
      handleErrors('Error in creating Multisig, error');
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
