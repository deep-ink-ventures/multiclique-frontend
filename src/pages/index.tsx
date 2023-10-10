import ConnectWallet from '@/components/ConnectWallet';
import Welcome from '@/components/Welcome';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';

const Index = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);

  return (
    <MainLayout
      title={'MultiClique - Stellar Soroban Multisig Tools'}
      description={'A platform for all your multisig needs'}>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] overflow-hidden p-3'>
        {currentAccount?.isConnected ? <Welcome /> : <ConnectWallet />}
      </div>
    </MainLayout>
  );
};

export default Index;
