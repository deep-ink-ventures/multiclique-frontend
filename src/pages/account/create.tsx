import ConnectWallet from '@/components/ConnectWallet';
import type { ICreateMultisigFormProps } from '@/components/CreateMultisigForm';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import useMC from '@/hooks/useMC';

import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import type { SubmitHandler } from 'react-hook-form';

const Create = () => {
  const [currentAccount, handleErrors, elioConfig] = useMCStore((s) => [
    s.currentAccount,
    s.handleErrors,
    s.elioConfig,
  ]);

  const {
    getMulticliqueAddresses,
    initMulticliqueCore,
    initMulticliquePolicy,
  } = useMC();

  const onSubmit: SubmitHandler<ICreateMultisigFormProps> = async (data) => {
    if (!currentAccount || !elioConfig) return;

    const { creatorAddress, signatories, threshold } = data;

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
    //
    try {
      await getMulticliqueAddresses(
        multicliqueData,
        (addresses: { coreAddress: string; policyAddress: string }) => {
          initMulticliqueCore(
            addresses,
            signerAddresses,
            threshold,
            async () => {
              initMulticliquePolicy(addresses.policyAddress, {
                multiclique: addresses.coreAddress,
                elioCore: elioConfig?.coreContractAddress,
                elioVotes: elioConfig?.votesContractAddress,
                elioAssets: elioConfig?.votesContractAddress,
              });
            }
          );
        }
      );
    } catch (err) {
      handleErrors('Error in transferring ownership to multisig', err);
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
