import useMCStore from '@/stores/MCStore';
import Chevron from '@/svg/components/Chevron';
import freighter from '@/svg/freighter-icon.svg';
import Image from 'next/image';
import type { ReactNode } from 'react';

const Wallet = ({
  children,
  walletImg,
  walletName,
}: {
  children?: ReactNode;
  walletImg: string;
  walletName: string;
}) => {
  const [getWallet] = useMCStore((s) => [s.getWallet]);

  const handleWalletSelect = async () => {
    getWallet();
  };

  return (
    <button
      className='btn-outline btn flex h-fit items-center justify-center gap-4 !rounded-lg px-4 py-2'
      onClick={() => handleWalletSelect()}>
      <Image src={walletImg} height={35} width={35} alt={walletName} />
      <div>{walletName}</div>
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
      </div>
      {/* TODO: Remove once WalletConnect is integrated */}
      <Wallet walletImg={freighter} walletName='Freighter' />
    </>
  );
};

export const ConnectWallet = {
  Panel,
};
