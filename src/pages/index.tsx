import ConnectWallet from '@/components/ConnectWallet';
import Welcome from '@/components/Welcome';
import useMCStore from '@/stores/MCStore';
import { useEffect } from 'react';

const Index = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);

  useEffect(() => {
    console.log('currentAccount', currentAccount);
  });

  return (
    <>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] overflow-hidden p-3'>
        {currentAccount?.isConnected ? <Welcome /> : <ConnectWallet />}
      </div>
    </>
  );
};

export default Index;
