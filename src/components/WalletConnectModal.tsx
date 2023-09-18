import { isConnected } from '@stellar/freighter-api';

import useMCStore from '@/stores/MCStore';
import freight from '@/svg/freight.svg';
import rightArrow from '@/svg/rightArrow.svg';
import Modal from 'antd/lib/modal';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const WalletConnectModal = () => {
  const [updateIsConnectModalOpen, isConnectModalOpen, getWallet] = useMCStore(
    (s) => [s.updateIsConnectModalOpen, s.isConnectModalOpen, s.getWallet]
  );

  const [hasFreighter, setHasFreighter] = useState(false);

  const handleWalletSelect = async () => {
    getWallet();
    updateIsConnectModalOpen(false);
  };

  useEffect(() => {
    const getFreighter = async () => {
      const isFreighterInstalled = await isConnected();
      setHasFreighter(isFreighterInstalled);
    };
    getFreighter();
  }, []);

  return (
    <Modal
      open={isConnectModalOpen}
      confirmLoading={false}
      wrapClassName='a-modal-bg'
      className='wallet-modal'
      onCancel={() => {
        updateIsConnectModalOpen(false);
      }}
      footer={null}
      width={615}
      centered
      zIndex={99}>
      <div className='flex flex-col items-center justify-center text-center'>
        <div>
          <h2>Select a wallet to connect</h2>
        </div>
        <div className='my-4 flex h-[200px] w-full flex-col items-center justify-center'>
          {hasFreighter ? (
            <button
              className='btn btn-outline h-16 w-[75%] !rounded-lg'
              name={'Freighter'}
              onClick={() => handleWalletSelect()}>
              <div className='flex w-full items-center justify-between'>
                <Image src={freight} height={35} width={35} alt='freight' />
                <div>{'Freighter'}</div>
                <Image
                  src={rightArrow}
                  height={8}
                  width={15}
                  alt='right arrow'
                />
              </div>
            </button>
          ) : (
            <div className='text-xl'>
              <a
                href='https://freighter.app/'
                target='_blank'
                className='underline'>
                Please install Freighter Wallet
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
