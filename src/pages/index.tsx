import ConnectWallet from '@/components/ConnectWallet';
import Welcome from '@/components/Welcome';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import { useEffect } from 'react';

const Index = () => {
  const [currentAccount, isTxnProcessing] = useMCStore((s) => [
    s.currentAccount,
    s.isTxnProcessing,
  ]);

  const loaderContext = useLoadingScreenContext();
  useEffect(() => {
    if (isTxnProcessing) {
      loaderContext.setAction({
        type: 'SHOW_TRANSACTION_PROCESSING',
      });
    } else {
      loaderContext.setAction({
        type: 'CLOSE',
      });
    }
  }, [isTxnProcessing]);

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
