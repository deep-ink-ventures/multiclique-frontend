import ConnectWallet from '@/components/ConnectWallet';

import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import { ErrorMessage } from '@hookform/error-message';
import cn from 'classnames';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import StellarSdk from 'stellar-sdk';

interface CreateTransactionFormValues {
  xdr: string | null;
}

const MAX_XDR_CHAR_COUNT = 4096;

const CreateTransaction = () => {
  const [currentAccount, handleErrors, isTxnProcessing] = useMCStore((s) => [
    s.currentAccount,
    s.handleErrors,
    s.isTxnProcessing,
  ]);

  const formMethods = useForm<CreateTransactionFormValues>({
    defaultValues: {
      xdr: null,
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const onSubmit: SubmitHandler<CreateTransactionFormValues> = async (data) => {
    if (!currentAccount) return;

    const { xdr } = data;

    try {
      const isValidXDR = StellarSdk.xdr.TransactionEnvelope.validateXDR(
        xdr?.toString(),
        'base64'
      );

      if (!isValidXDR)
        return setError('xdr', {
          message: 'Invalid XDR',
        });
    } catch (err) {
      handleErrors('Error in creating transaction using XDR', err);
    }
  };

  const xdrWatch = watch('xdr');
  return (
    <MainLayout
      title={'MultiClique - Create Account'}
      description={'Create a new Multisig Account'}>
      <div className='container mx-auto mt-5 w-full min-w-[600px] max-w-[820px] overflow-hidden p-4'>
        {currentAccount?.isConnected ? (
          <>
            <div className='my-3 w-full text-center'>
              <h1 className='text-xl'>Create transaction</h1>
            </div>
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='my-5 flex w-full flex-col items-center justify-around space-y-7'>
                  <div className='flex flex-col items-center justify-center'>
                    Enter an XDR to import a transaction
                  </div>
                  <div className='flex w-1/2 flex-col justify-center'>
                    <div className='w-full'>
                      <div className='flex items-end justify-between'>
                        <p className='mb-1 ml-2'>
                          XDR{' '}
                          <span className='text-lg font-medium text-red-600'>
                            *
                          </span>
                        </p>
                      </div>
                      <div className='relative'>
                        <textarea
                          className={cn('w-full p-2')}
                          placeholder=''
                          rows={10}
                          disabled={isTxnProcessing}
                          {...register('xdr', {
                            required: 'Required',
                            min: {
                              value: 3,
                              message: 'Minimum character count is 3',
                            },
                            pattern: {
                              value:
                                /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
                              message: 'Input is not a valid base64',
                            },
                            max: {
                              value: MAX_XDR_CHAR_COUNT,
                              message: `Maximum character count is ${MAX_XDR_CHAR_COUNT}`,
                            },
                          })}
                        />

                        <div className='mt-2 flex  w-full items-center justify-between'>
                          <p className='text-sm text-neutral-focus'>
                            Input a base-64 encoded XDR blob
                          </p>
                          <p
                            className={` text-right opacity-60 ${
                              !xdrWatch || xdrWatch?.length > MAX_XDR_CHAR_COUNT
                                ? 'text-error-content'
                                : null
                            }`}>
                            {xdrWatch?.length}/{MAX_XDR_CHAR_COUNT}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name='xdr'
                      render={({ message }) => (
                        <p className='ml-2 mt-1 text-error-content'>
                          {message}
                        </p>
                      )}
                    />
                  </div>
                </div>
                <div className='mb-3 mt-6 flex w-full justify-center'>
                  <button
                    className={cn(`btn btn-primary mr-3 w-48`, {
                      loading: isTxnProcessing,
                    })}
                    disabled={isTxnProcessing}
                    type='submit'>
                    {`${isTxnProcessing ? 'Processing' : 'Submit'}`}
                  </button>
                </div>
              </form>
            </FormProvider>
          </>
        ) : (
          <ConnectWallet />
        )}
      </div>
    </MainLayout>
  );
};

export default CreateTransaction;
