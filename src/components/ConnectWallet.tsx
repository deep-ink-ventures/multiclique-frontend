import Chevron from '@/svg/components/Chevron';
import type { ReactNode } from 'react';

const Wallet = ({ children }: { children?: ReactNode }) => {
  return (
    <button className='btn btn-outline flex items-center gap-4 !rounded-lg px-4 py-2'>
      {children}
      <Chevron className='h-4 w-4 fill-black' />
    </button>
  );
};

const Panel = () => {
  return (
    <>
      <div className='space-y-2 text-center'>
        <div className='text-xl font-semibold'>Connect Wallet</div>
        <p className='text-lg'>You need to connect your wallet account</p>
      </div>
      {/* TODO: Remove once WalletConnect is integrated */}
      <Wallet>Freighter</Wallet>
    </>
  );
};

export const ConnectWallet = {
  Panel,
};
