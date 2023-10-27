import ConnectWallet from '@/components/ConnectWallet';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import useMC from '@/hooks/useMC';

import useMCStore, { TxnResponse } from '@/stores/MCStore';
import { validateXDR } from '@/utils/helpers';
import { ErrorMessage } from '@hookform/error-message';
import cn from 'classnames';
import { useState, type ReactNode } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

interface IImportTransactionProps {
  isVisible?: boolean;
  accountId?: string;
  children?: ReactNode;
  onClose?: () => void;
}

interface CreateTransactionFormValues {
  xdr: string | null;
}

const MAX_XDR_CHAR_COUNT = 4096;

const ImportTransactionModal = (props: IImportTransactionProps) => {
  const { isVisible, accountId, onClose } = props;

  const [loading, setIsLoading] = useState(false);

  const loaders = useLoadingScreenContext();

  const [currentWalletAccount, handleErrors, MCConfig, addTxnNotification] =
    useMCStore((s) => [
      s.currentWalletAccount,
      s.handleErrors,
      s.MCConfig,
      s.addTxnNotification,
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
    reset,
    setError,
    formState: { errors },
  } = formMethods;

  const { getJwtToken, createMCTransactionDB } = useMC();

  const onSubmit: SubmitHandler<CreateTransactionFormValues> = async (data) => {
    if (!currentWalletAccount) return;

    const { xdr } = data;

    if (!accountId) {
      return;
    }

    try {
      setIsLoading(true);
      loaders.setAction({
        type: 'SHOW_TRANSACTION_PROCESSING',
      });
      const isValidXDR =
        MCConfig &&
        xdr &&
        validateXDR(xdr.trim().toString(), MCConfig.networkPassphrase);

      if (isValidXDR) {
        const jwt = await getJwtToken(accountId);
        if (!jwt) {
          return;
        }

        const response = await createMCTransactionDB(xdr, jwt);

        if (response?.id) {
          addTxnNotification({
            type: TxnResponse.Success,
            title: 'Import XDR',
            timestamp: Date.now(),
            message: 'Transaction created successfully',
          });
        }

        reset();
      } else {
        setError('xdr', {
          message: 'Invalid XDR',
        });
      }
    } catch (err) {
      handleErrors('Error in creating transaction using XDR', err);
    } finally {
      setIsLoading(false);
      loaders.setAction({
        type: 'CLOSE',
      });
      if (onClose) {
        onClose();
      }
    }
  };

  const xdrWatch = watch('xdr');

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[900] flex h-full w-full items-center justify-center',
        {
          hidden: !isVisible || loading,
        }
      )}>
      <div
        className='absolute h-full w-full bg-black opacity-50'
        onClick={() => {
          reset();
          if (onClose) {
            onClose();
          }
        }}
      />
      <div className='z-[1050] flex flex-col items-center justify-center gap-5 rounded-lg bg-white p-8 opacity-100'>
        <div className='w-full min-w-[600px] max-w-[820px] overflow-hidden'>
          {currentWalletAccount?.isConnected ? (
            <>
              <div className='my-3 w-full text-center'>
                <h1 className='text-2xl'>Create transaction</h1>
              </div>
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                  <div className=' my-5 flex w-full flex-col items-center justify-around space-y-7'>
                    <div className='flex flex-col items-center justify-center'>
                      Enter an XDR to import a transaction
                    </div>
                    <div className='flex w-full flex-col justify-center'>
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
                            disabled={loading}
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
                                !xdrWatch ||
                                xdrWatch?.length > MAX_XDR_CHAR_COUNT
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
                        loading,
                      })}
                      disabled={loading}
                      type='submit'>
                      {`${loading ? 'Processing' : 'Submit'}`}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportTransactionModal;
