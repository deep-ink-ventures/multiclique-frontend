import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import WalletConnectModal from '@/components/WalletConnectModal';

import useMCStore from '@/stores/MCStore';
import avatar from '@/svg/avatar.svg';
import Logout from '@/svg/components/Logout';

import Chevron from '@/svg/components/Chevron';
import Wallet from '@/svg/components/Wallet';
import { truncateMiddle } from '../utils/index';

interface WalletConnectProps {
  text: string;
  onClose?: () => void;
}

const WalletConnect = (props: WalletConnectProps) => {
  const [
    isConnectModalOpen,
    updateIsConnectModalOpen,
    currentWalletAccount,
    updateCurrentWalletAccount,
    isTxnProcessing,
    updateJwt,
  ] = useMCStore((s) => [
    s.isConnectModalOpen,
    s.updateIsConnectModalOpen,
    s.currentWalletAccount,
    s.updateCurrentWalletAccount,
    s.isTxnProcessing,
    s.updateJwt,
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // const handleOpenModal = () => {
  //   updateIsConnectModalOpen(!isConnectModalOpen);
  // };

  const handleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleModalOpen = () => {
    updateIsConnectModalOpen(true);
  };

  const handleDisconnect = () => {
    updateCurrentWalletAccount(null);
    updateJwt(null);
    setDropdownOpen(false);
  };

  return (
    <div className='relative flex flex-col'>
      <button
        tabIndex={0}
        className={cn('btn btn-outline m-1', {
          loading:
            (isConnectModalOpen && !currentWalletAccount?.isConnected) ||
            isTxnProcessing,
        })}
        onClick={
          !currentWalletAccount?.isConnected ? handleModalOpen : handleDropDown
        }>
        {currentWalletAccount ? (
          <div className='mr-2'>
            <Image src={avatar} alt='avatar' height='18' width='18'></Image>
          </div>
        ) : (
          <div
            className={cn('mr-2', {
              hidden: isConnectModalOpen,
            })}>
            <Wallet className='h-3 w-3 stroke-black' />
          </div>
        )}
        <span className='align-middle'>
          {!currentWalletAccount
            ? props.text
            : `${truncateMiddle(currentWalletAccount?.publicKey, 5, 4)}`}
        </span>
        {Boolean(currentWalletAccount) && (
          <span className='ml-2'>
            <Chevron direction='down' />
          </span>
        )}
      </button>
      <div
        className={cn(
          'shadow-[0_0_4px_0_rgba(255, 255, 255, 0.20)] absolute right-0 top-[65px] w-full space-y-2 rounded-2xl border-[0.5px] border-neutral bg-base-100 py-1 shadow-sm hover:bg-base-300',
          {
            hidden: !dropdownOpen,
          }
        )}>
        <div
          className={`group flex cursor-pointer items-center gap-2 px-4 py-2 text-sm`}
          onClick={handleDisconnect}>
          <Logout width={20} height={20} className='' /> Disconnect
        </div>
      </div>
      <WalletConnectModal />
    </div>
  );
};

export default WalletConnect;
