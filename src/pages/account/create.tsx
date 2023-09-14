import ConnectWallet from '@/components/ConnectWallet';
import CreateMultisigForm from '@/components/CreateMultisigForm';

import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';

const Create = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);

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
              <CreateMultisigForm />
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
