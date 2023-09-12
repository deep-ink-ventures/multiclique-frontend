import { v4 as uuidv4 } from 'uuid';

import useMCStore from '@/stores/MCStore';

import NotificationToast from '@/components/NotificationToast';

const TransactionNotification = () => {
  const txnNotifications = useMCStore((s) => s.txnNotifications);

  return (
    <div className='flex justify-center'>
      <div className='fixed top-[20px] z-[1000]'>
        {txnNotifications.map((noti) => {
          return (
            <NotificationToast
              key={uuidv4()}
              type={noti.type}
              title={noti.title}
              message={noti.message}
              timestamp={noti.timestamp}
              txnHash={noti.txnHash}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TransactionNotification;
