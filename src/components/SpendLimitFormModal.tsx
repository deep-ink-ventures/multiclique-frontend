import cn from 'classnames';
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
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[900] flex h-full w-full items-center justify-center',
        {
          hidden: !visible,
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
        <div className='w-full min-w-[400px]'>
          <h1 className='mb-6 text-center text-2xl'>{title}</h1>
          <SpendLimitForm />
        </div>
      </div>
    </div>
  );
};

export default SpendLimitFormModal;
