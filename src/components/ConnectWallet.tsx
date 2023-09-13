import Link from 'next/link';
import WalletConnect from './WalletConnect';

const ConnectWallet = () => {
  return (
    <div className='mt-1 flex flex-col justify-center gap-y-6 p-12'>
      <div className='flex w-full flex-col items-center gap-8'>
        <div className='text-lg'>Please connect your wallet to continue</div>
        <WalletConnect text='Connect Wallet' />
        <Link href='/' className='text-lg underline'>
          {`Help, I don't have a wallet`}
        </Link>
      </div>
    </div>
  );
};

export default ConnectWallet;
