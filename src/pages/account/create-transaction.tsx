import ConnectWallet from '@/components/ConnectWallet';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import useMC from '@/hooks/useMC';

import { MainLayout } from '@/layouts';
import { TransactionService } from '@/services';
import useMCStore, { TxnResponse } from '@/stores/MCStore';
import { toBase64 } from '@/utils';
import { validateXDR } from '@/utils/helpers';
import { ErrorMessage } from '@hookform/error-message';
import { signBlob } from '@stellar/freighter-api';
import cn from 'classnames';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

interface CreateTransactionFormValues {
  xdr: string | null;
}

const MAX_XDR_CHAR_COUNT = 4096;

const CreateTransaction = () => {
  const [
    currentAccount,
    handleErrors,
    isTxnProcessing,
    MCConfig,
    addTxnNotification,
  ] = useMCStore((s) => [
    s.currentAccount,
    s.handleErrors,
    s.isTxnProcessing,
    s.MCConfig,
    s.addTxnNotification,
  ]);

  const { getJwtToken } = useMC();

  const loaders = useLoadingScreenContext();

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
    reset,
    formState: { errors },
  } = formMethods;

  const onSubmit: SubmitHandler<CreateTransactionFormValues> = async (data) => {
    if (!currentAccount) return;

    const { xdr } = data;

    try {
      loaders.setAction({
        type: 'SHOW_TRANSACTION_PROCESSING',
      });

      const isValidXDR =
        MCConfig &&
        xdr &&
        validateXDR(xdr.trim().toString(), MCConfig.networkPassphrase);

      if (isValidXDR) {
        const jwt = await getJwtToken(currentAccount?.publicKey);
        if (!jwt) {
          return;
        }

        const response = await TransactionService.createMultiCliqueTransaction(
          {
            xdr,
          },
          jwt
        );

        // CHECK IF THIS IS CORRECT
        const signedTx = await signBlob(toBase64(response.preimageHash), {
          accountToSign: currentAccount?.publicKey,
        });

        const updateTx = await TransactionService.patchMultiCliqueTransaction(
          response.id.toString(),
          {
            approvals: [
              {
                signatory: {
                  name: currentAccount.publicKey,
                  address: currentAccount.publicKey,
                },
                signature: toBase64(signedTx),
              },
            ],
          },
          jwt
        );

        console.log('updateTx', updateTx);

        addTxnNotification({
          type: TxnResponse.Warning,
          title: 'Import XDR',
          timestamp: Date.now(),
          message: updateTx.status,
        });

        reset();
      } else {
        setError('xdr', {
          message: 'Invalid XDR',
        });
      }
    } catch (err) {
      handleErrors('Error in creating transaction using XDR', err);
    } finally {
      loaders.setAction({
        type: 'CLOSE',
      });
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
