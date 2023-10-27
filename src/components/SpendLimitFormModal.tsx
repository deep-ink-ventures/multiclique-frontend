import Switch from '@/svg/components/Switch';
import cn from 'classnames';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import SpendLimitForm from './SpendLimitForm';

interface SpendLimitFormModalProps {
  visible?: boolean;
  title?: string;
  onClose?: () => void;
}

const SpendLimitFormModal = ({
  title,
  visible,
  onClose,
}: SpendLimitFormModalProps) => {
  const [isConfirmResetVisible, setIsConfirmResetVisible] = useState(false);

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-[900] flex h-full w-full items-center justify-center',
          {
            hidden: !visible || isConfirmResetVisible,
          }
        )}>
        <div
          className='absolute h-full w-full bg-black opacity-50'
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        />
        <div className='z-[1050] flex flex-col items-center justify-center gap-5 rounded-lg bg-white p-8 opacity-100'>
          <div className='w-full min-w-[500px]'>
            <h1 className='relative mb-6 text-center text-2xl'>
              {title}
              <button
                className='btn btn-outline absolute right-0 !h-10 !min-h-[0px] truncate !py-1'
                onClick={() => setIsConfirmResetVisible(true)}>
                <Switch className='mr-1 h-4 fill-base-content' /> Reset
              </button>
            </h1>
            <SpendLimitForm />
          </div>
        </div>
      </div>
      <ConfirmationModal
        title={<div className='text-error-content'>Reset Spend Limit</div>}
        visible={isConfirmResetVisible}
        onClose={() => setIsConfirmResetVisible(false)}
        onConfirm={() => setIsConfirmResetVisible(false)}>
        Are you sure you want to reset the spend limit?
      </ConfirmationModal>
    </>
  );
};

export default SpendLimitFormModal;
