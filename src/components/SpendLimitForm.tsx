import { ErrorMessage } from '@hookform/error-message';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

export type ExtendedSpendLimitFormValues<Generic extends string> = {
  [Key in keyof SpendLimitFormValues as `${Generic}${Capitalize<
    string & Key
  >}`]: string;
};

interface SpendLimitFormProps {
  formName?: string;
  disabled?: boolean;
  onSubmit?: <T extends string>(
    data: ExtendedSpendLimitFormValues<T>
  ) => Promise<boolean> | boolean;
}
interface SpendLimitFormValues {
  SpendLimit: number;
}

const SpendLimitForm = ({
  formName,
  onSubmit,
  disabled,
}: SpendLimitFormProps) => {
  const formMethods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
  } = formMethods;

  const handleOnSubmit: SubmitHandler<any> = async (data) => {
    if (onSubmit) {
      const isSuccess = await onSubmit(data);
      if (isSuccess === true) {
        reset();
      }
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
              disabled={disabled}
              {...register(`${formName}SpendLimit`, {
                required: 'Required',
              })}
            />
            <ErrorMessage
              errors={errors}
              name={`${formName}SpendLimit`}
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error-content'>{message}</p>
              )}
            />
          </div>
          <button className='btn btn-primary ml-auto mt-8 w-full truncate'>
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SpendLimitForm;
