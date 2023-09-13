import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import WalletConnectModal from '@/components/WalletConnectModal';

import useMCStore from '@/stores/MCStore';
import avatar from '@/svg/avatar.svg';
import Logout from '@/svg/components/Logout';

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
    updateCurrentAccount,
    isTxnProcessing,
  ] = useMCStore((s) => [
    s.isConnectModalOpen,
    s.updateIsConnectModalOpen,
    s.currentAccount,
    s.updateCurrentAccount,
    s.isTxnProcessing,
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
    updateCurrentAccount(null);
    setDropdownOpen(false);
  };

  return (
    <div className='relative flex flex-col'>
      <button
        tabIndex={0}
        className={`btn m-1 ${
          !currentWalletAccount
            ? 'btn-outline'
            : 'btn-connected hover:bg-base-200'
        }
            ${
              isConnectModalOpen &&
              !currentWalletAccount?.isConnected &&
              'loading'
            } 
            ${isTxnProcessing && 'loading'}
            `}
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
        {currentWalletAccount ? (
          <span className='ml-2'>
            <svg
              width='20'
              height='16'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M11.9802 16.9929C11.8484 16.9929 11.7099 16.9671 11.5648 16.9156C11.4198 16.864 11.2813 16.7739 11.1495 16.645L3.35604 9.03111C3.11868 8.79921 3 8.51579 3 8.18082C3 7.84586 3.11868 7.56244 3.35604 7.33054C3.59341 7.09865 3.87033 6.9827 4.18681 6.9827C4.5033 6.9827 4.78022 7.09865 5.01758 7.33054L11.9802 14.1328L18.9429 7.33054C19.1802 7.09865 19.4637 6.9827 19.7934 6.9827C20.1231 6.9827 20.4066 7.09865 20.644 7.33054C20.8813 7.56244 21 7.83942 21 8.1615C21 8.48358 20.8813 8.76057 20.644 8.99246L12.811 16.645C12.6791 16.7739 12.5473 16.864 12.4154 16.9156C12.2835 16.9671 12.1385 16.9929 11.9802 16.9929Z'
                fill='#2E2E2E'
              />
            </svg>
          </span>
        ) : null}
      </button>
      <div
        className={cn(
          'shadow-[0_0_4px_0_rgba(255, 255, 255, 0.20)] absolute right-0 top-[65px] w-full space-y-2 rounded-2xl border-[0.5px] border-neutral bg-base-100 py-1 shadow-sm hover:bg-base-200',
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
