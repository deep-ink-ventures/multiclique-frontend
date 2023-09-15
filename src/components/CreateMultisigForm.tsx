import useMCStore from '@/stores/MCStore';
import { ErrorMessage } from '@hookform/error-message';
import type { ReactNode } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import useMC from '@/hooks/useMC';
import type { Multisig } from '@/types/multisig';
import { truncateMiddle } from '@/utils';
import cn from 'classnames';
import SignatoriesForm from './SignatoriesForm';

interface ICreateMultisigFormProps extends Multisig {
  creatorName: string;
  creatorAddress: string;
}

const Members = ({ title = 'Add Multisig Signers' }: { title?: string }) => {
  const [currentAccount, isTxnProcessing] = useMCStore((s) => [
    s.currentAccount,
    s.isTxnProcessing,
  ]);

  const formMethods = useFormContext();

  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <>
      <div>
        <h4 className='text-center'>{title}</h4>
        <p className='px-24 text-center text-sm'>
          {`Enter at least 2 Multisig Signers. The signers' addresses will
                be used to create a multi-signature account on MultiClique.`}
        </p>
      </div>
      <div className='flex w-full px-4'>
        <div className='mr-3 flex w-1/4 flex-col'>
          <p className='pl-8'>Your Name</p>
          <div className='flex'>
            <div className='mr-4 flex flex-col justify-center'>1</div>
            <input
              type='text'
              placeholder='Your name'
              className='input input-primary'
              disabled={isTxnProcessing}
              {...register('creatorName', {
                required: 'Required',
                minLength: { value: 1, message: 'Minimum is 1' },
                maxLength: { value: 30, message: 'Maximum is 30' },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name='creatorName'
            render={({ message }) => (
              <p className='mt-1 pl-8 text-error-content'>{message}</p>
            )}
          />
        </div>
        <div className='flex flex-auto flex-col'>
          <p className='ml-1'>Wallet Address</p>
          <input type='text' hidden {...register('creatorAddress')} />
          <div className='flex h-12 items-center rounded-[10px] border-[0.3px] bg-base-100 px-2 opacity-50'>
            {currentAccount
              ? truncateMiddle(currentAccount?.publicKey, 5, 5)
              : 'Please Connect Wallet'}
          </div>
        </div>
      </div>
      <SignatoriesForm
        formName='signatories'
        listStartCount={2}
        disabled={isTxnProcessing}
      />
    </>
  );
};

const SigningThreshold = () => {
  const [isTxnProcessing] = useMCStore((s) => [s.isTxnProcessing]);

  const formMethods = useFormContext();

  const {
    register,
    watch,
    formState: { errors },
  } = formMethods;

  const signatories = watch('signatories');

  const membersCount = signatories.length + 1 ?? 0;

  const maxThreshold = Math.max(membersCount, 16);
  return (
    <>
      <div>
        <h4 className='text-center'>Enter Signing Threshold</h4>
        <p className='px-20 text-center text-sm'>
          The signing threshold is a the minimum number of signatures needed to
          approve a multi-signature transaction. The minimum threshold is 2.
        </p>
      </div>
      <div className='w-[120px]'>
        <input
          className='input input-primary text-center'
          type='number'
          placeholder='1'
          disabled={isTxnProcessing}
          {...register('threshold', {
            required: 'Required',
            min: { value: 1, message: 'Minimum is 2' },
            max: {
              value: maxThreshold,
              message: 'Cannot exceed # of council members',
            },
          })}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name='threshold'
        render={({ message }) => (
          <p className='ml-2 mt-1 text-error-content'>{message}</p>
        )}
      />
      <p className='text-lg'>
        {`Out of `}
        <span className='text-xl text-warning-content'>{membersCount}</span>
        {` Signers Needed To Approve a Transaction`}
      </p>
    </>
  );
};

const CreateMultisigForm = ({ children }: { children?: ReactNode }) => {
  const [currentAccount, isTxnProcessing, updateIsTxnProcessing, handleErrors] =
    useMCStore((s) => [
      s.currentAccount,
      s.isTxnProcessing,
      s.updateIsTxnProcessing,
      s.handleErrors,
    ]);

  const { getMulticliqueAddresses, initMulticliqueCore } = useMC();

  const onSubmit = async (data: ICreateMultisigFormProps) => {
    console.log('ICreateMultisigFormProps data', data);

    if (!currentAccount) return;

    const { creatorAddress, signatories, threshold } = data;

    const allSigners = [
      creatorAddress,
      ...signatories.map((signer) => signer.address),
    ];

    const multicliqueData = {
      source: currentAccount.publicKey,
      policy_preset: 'ELIO_DAO',
    };

    try {
      await getMulticliqueAddresses(
        multicliqueData,
        (addresses: { coreAddress: string; policyAddress: string }) => {
          initMulticliqueCore(addresses, allSigners, threshold, async () => {
            // await for 3 seconds
            await new Promise((resolve) => {
              setTimeout(resolve, 3000);
            });
            updateIsTxnProcessing(false);
          });
        }
      );
    } catch (err) {
      handleErrors('Error in transferring ownership to multisig', err);
    }
  };

  const formMethods = useForm<ICreateMultisigFormProps>({
    defaultValues: {
      creatorName: '',
      creatorAddress: currentAccount?.publicKey,
      signatories: [
        {
          name: '',
          address: '',
        },
      ],
      threshold: 1,
    },
  });

  const { handleSubmit, watch } = formMethods;

  const signatories = watch('signatories');

  const membersCount = signatories.length + 1 ?? 0;

  return (
    <FormProvider {...formMethods}>
      <div className='flex flex-col items-center gap-y-5 '>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <div className='mb-6 flex w-full flex-col items-center gap-y-5 rounded-lg border-[0.5px] border-black/40 py-5 hover:brightness-100'>
            {children}
          </div>
          <div className='mb-3 mt-6 flex w-full justify-end'>
            <button
              className={cn(`btn btn-primary mr-3 w-48`, {
                loading: isTxnProcessing,
              })}
              disabled={isTxnProcessing || !currentAccount || membersCount < 2}
              type='submit'>
              {`${isTxnProcessing ? 'Processing' : 'Approve and Sign'}`}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

CreateMultisigForm.Members = Members;
CreateMultisigForm.Threshold = SigningThreshold;

export default CreateMultisigForm;
