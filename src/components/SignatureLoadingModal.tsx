import MemberSign from '@/svg/components/MemberSign';
import cn from 'classnames';
import LoadingModal from './LoadingModal';
import Stepper from './Stepper';

interface ISignatureLoadingModalProps {
  isVisible?: boolean;
  totalSignCount?: number;
  currentSignCount?: number;
  loading?: boolean;
  isComplete?: boolean;
}

const SignatureLoadingModal = ({
  isVisible,
  currentSignCount = 0,
  totalSignCount = 0,
  isComplete = false,
}: ISignatureLoadingModalProps) => {
  return (
    <LoadingModal isVisible={isVisible}>
      <div className='text-2xl font-semibold'>Transaction Pending</div>
      <div className='w-96'>
        <Stepper>
          {Array(totalSignCount)
            .fill(null)
            .map((item, index) => (
              <Stepper.Step
                key={index}
                isLast={index + 1 === totalSignCount}
                active={currentSignCount === index + 1 && !isComplete}
                completed={currentSignCount > index + 1 || isComplete}>
                <div className='relative'>
                  <MemberSign
                    className={cn('h-5 w-5 ', {
                      'animate-pulse':
                        currentSignCount === index + 1 && !isComplete,
                    })}
                  />
                </div>
              </Stepper.Step>
            ))}
        </Stepper>
      </div>
      <div className='text-center'>
        <div className='text-lg'>
          {isComplete ? totalSignCount : currentSignCount - 1} out of{' '}
          {totalSignCount}
        </div>
        <div>signature{totalSignCount > 1 && 's'} complete</div>
      </div>
    </LoadingModal>
  );
};

export default SignatureLoadingModal;
