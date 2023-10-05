import MemberSign from '@/svg/components/MemberSign';
import cn from 'classnames';
import Stepper from './Stepper';

export interface ISignatureLoadingProps {
  totalSignCount?: number;
  currentSignCount?: number;
  loading?: boolean;
  isComplete?: boolean;
}

const SignatureLoading = ({
  currentSignCount = 0,
  totalSignCount = 0,
  isComplete = false,
}: ISignatureLoadingProps) => {
  return (
    <>
      <div className='text-2xl font-semibold'>Transaction Pending...</div>
      {/*  TODO: add a spinner */}
      <div className='w-96'>
        <Stepper>
          {Array(totalSignCount)
            .fill(null)
            .map((_item, index) => (
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
        <div>approvals{totalSignCount > 1 && 's'} complete</div>
      </div>
    </>
  );
};

export default SignatureLoading;
