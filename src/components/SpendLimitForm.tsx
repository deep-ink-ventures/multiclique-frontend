import { ErrorMessage } from '@hookform/error-message';
import BigNumber from 'bignumber.js';
import { useState, type ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import useMC from '@/hooks/useMC';
import useMCStore from '@/stores/MCStore';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import { DAO_UNITS } from '@/config';

export type ExtendedSpendLimitFormValues<Generic extends string> = {
  [Key in keyof SpendLimitFormValues as `${Generic}${Capitalize<
    string & Key
  >}`]: string;
};

interface SpendLimitFormProps {
  policyAddress: string;
  assetContractAddress: string
  formName?: string;
  disabled?: boolean;
  actionButton?: ReactNode;
  onSubmit?: <T extends string>(
    data: ExtendedSpendLimitFormValues<T>
  ) => Promise<boolean> | boolean;
}

interface SpendLimitFormValues {
  spendLimit: BigNumber;
}

const SpendLimitForm = ({
  policyAddress,
  assetContractAddress,
  formName,
  onSubmit,
  actionButton,
  disabled,
}: SpendLimitFormProps) => {
  const formMethods = useForm<SpendLimitFormValues>();
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
  } = formMethods;
  const [isLoading, setIsLoading] = useState(false)
  const {setSpendLimit} = useMC();
  const [ handleErrors] = useMCStore((s) => [ s.handleErrors]);
  const loaders = useLoadingScreenContext();


  const handleOnSubmit: SubmitHandler<SpendLimitFormValues> = async (data) => {
    try {
      setIsLoading(true);
      loaders.setAction({
        type: 'SHOW_TRANSACTION_PROCESSING',
      });
      await setSpendLimit(policyAddress, assetContractAddress, data.spendLimit);
    } catch (error) {
      handleErrors('Error in setting spend limit', error);
      setIsLoading(false);
      loaders.setAction({
        type: 'CLOSE',
      });
      reset();
    } finally {
      setIsLoading(false);
      loaders.setAction({
        type: 'CLOSE',
      });
      reset();
    }

  };
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className='flex h-full flex-col justify-between'>
          <div className='w-full space-y-2'>
            <p className='ml-1 text-lg'>Spend Limit</p>
            <input
              type='number'
              placeholder='Enter Spend Limit'
              className='input input-primary'
              disabled={isLoading}
              {...register(`spendLimit`, {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
                max: { value: 1000000000, message: 'Max is 1,000,000,000' },
                setValueAs: (tokens) => {
                  const bnTokens = BigNumber(tokens).multipliedBy(BigNumber(DAO_UNITS));
                  return bnTokens;
                },
              }
              )}
            />
            <ErrorMessage
              errors={errors}
              name={`${formName}SpendLimit`}
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error-content'>{message}</p>
              )}
            />
          </div>
          <div className='mt-8 space-y-2'>
            {actionButton}
            <button className='btn btn-primary ml-auto w-full truncate'>
              Submit
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SpendLimitForm;
