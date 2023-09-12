import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';

const Index = () => {
  return (
    <>
      <div className='container mx-auto mt-5 min-w-[600px] max-w-[820px] overflow-hidden'>
        <div className='mt-1 flex flex-col justify-center gap-y-6 p-12'>
          <div className='flex w-full flex-col items-center gap-8'>
            <div className='text-lg'>
              Please connect your wallet to continue
            </div>
            <WalletConnect text='Connect Wallet' />
            <Link href='/' className='text-lg underline'>
              {`Help, I don't have a wallet`}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
