import ConnectWallet from '@/components/ConnectWallet';
import type { ICreateMultisigFormProps } from '@/components/CreateMultisigForm';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import useMC from '@/hooks/useMC';

import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import type { SubmitHandler } from 'react-hook-form';

const Create = () => {
  const [currentAccount, handleErrors, updateIsTxnProcessing] = useMCStore(
    (s) => [s.currentAccount, s.handleErrors, s.updateIsTxnProcessing]
  );

  const { getMulticliqueAddresses, initMulticliqueCore } = useMC();

  const onSubmit: SubmitHandler<ICreateMultisigFormProps> = async (data) => {
    if (!currentAccount) return;

    const { creatorAddress, signatories, threshold } = data;

    const allSigners = [
      creatorAddress,
      ...(signatories
        ?.filter((signer) => signer != null)
        .map((signer) => signer.address) ?? []),
    ];

    const multicliqueData = {
      source: currentAccount.publicKey,
      policy_preset: 'ELIO_DAO',
    };

    try {
      await getMulticliqueAddresses(
        multicliqueData,
        (addresses: { coreAddress: string; policyAddress: string }) => {
          initMulticliqueCore(addresses, allSigners, threshold, async () => {
            // await for 3 seconds
            await new Promise((resolve) => {
              setTimeout(resolve, 3000);
            });
            updateIsTxnProcessing(false);
          });
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
                <CreateMultisigForm.Members />
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
