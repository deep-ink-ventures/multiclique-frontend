import useMCStore from '@/stores/MCStore';
import { ErrorMessage } from '@hookform/error-message';
import type { ReactNode } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import type { Signatory } from '@/types/multiCliqueAccount';
import { truncateMiddle } from '@/utils';
import cn from 'classnames';
import SignatoriesForm from './SignatoriesForm';

export interface ISignatoriesFormValues {
  creatorName: string;
  creatorAddress: string;
  signatories: Signatory[];
}

export interface IThresholdFormValues {
  threshold: number;
}

export interface IAccountNameValues {
  accountName: string;
}

export type ICreateMultisigFormProps = ISignatoriesFormValues &
  IThresholdFormValues &
  IAccountNameValues;

const Signers = ({
  title = 'Add Multisig Signers',
  subtitle = "Enter at least 2 Multisig Signers. The signers' addresses will be used to create a multi-signature account on MultiClique.",
  maxSignatories,
  minSignatories,
  disableCreator,
  disableCount,
}: {
  title?: string;
  subtitle?: string;
  maxSignatories?: number;
  minSignatories?: number;
  disableCreator?: boolean;
  disableCount?: boolean;
}) => {
  const [currentWalletAccount, isTxnProcessing] = useMCStore((s) => [
    s.currentWalletAccount,
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
        <p className='px-24 text-center text-sm'>{subtitle}</p>
      </div>
      {!disableCreator && (
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
              {currentWalletAccount
                ? truncateMiddle(currentWalletAccount?.publicKey, 5, 5)
                : 'Please Connect Wallet'}
            </div>
          </div>
        </div>
      )}
      <SignatoriesForm
        formName='signatories'
        disabled={isTxnProcessing}
        maxCount={maxSignatories}
        minCount={minSignatories}
        disableCount={disableCount}
      />
    </>
  );
};

const SigningThreshold = ({
  minimumSigners = 1,
  maxSigners,
  title = 'Enter Signing Threshold',
}: {
  minimumSigners?: number;
  maxSigners?: number;
  title?: string;
}) => {
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
        <h4 className='text-center'>{title}</h4>
        <p className='px-20 text-center text-sm'>
          The signing threshold is a the minimum number of signatures needed to
          approve a multi-signature transaction. The minimum threshold is{' '}
          {minimumSigners}.
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
            min: { value: minimumSigners, message: 'Minimum is 1' },
            max: {
              value: maxSigners ?? maxThreshold,
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
        <span className='text-xl text-warning-content'>
          {maxSigners ?? membersCount}
        </span>
        {` Signers Needed To Approve a Transaction`}
      </p>
    </>
  );
};

const AccountName = ({ maxChars = 24 }: { maxChars?: number }) => {
  const [isTxnProcessing] = useMCStore((s) => [s.isTxnProcessing]);

  const formMethods = useFormContext();

  const {
    register,
    watch,
    formState: { errors },
  } = formMethods;

  const accountNameWatch = watch('accountName');

  return (
    <>
      <div>
        <h4 className='text-center'>Enter Account Name</h4>
        <p className='px-20 text-center text-sm'>
          This will be the name of the multisig account which will be stored
          off-chain.
        </p>
        <p className='px-20 text-center text-sm'>
          Max character count is {maxChars}.
        </p>
      </div>
      <div className='w-[340px]'>
        <div className='flex items-end justify-between'>
          <p className='mb-1 ml-2'>
            Account Name{' '}
            <span className='text-lg font-medium text-red-600'>*</span>
          </p>
        </div>
        <div className='relative'>
          <input
            className={cn('input', {
              'input-error': accountNameWatch.length > maxChars,
              'input-primary': accountNameWatch.length < maxChars,
            })}
            type='text'
            placeholder=''
            disabled={isTxnProcessing}
            {...register('accountName', {
              required: 'Required',
              min: { value: 3, message: 'Minimum character count is 3' },
              max: {
                value: maxChars,
                message: `Maximum character count is ${maxChars}`,
              },
            })}
          />
          <p
            className={`absolute right-2 top-3 opacity-60 ${
              accountNameWatch.length > maxChars ? 'text-error-content' : null
            }`}>
            {accountNameWatch.length}/{maxChars}
          </p>
        </div>
      </div>
      <ErrorMessage
        errors={errors}
        name='accountName'
        render={({ message }) => (
          <p className='ml-2 mt-1 text-error-content'>{message}</p>
        )}
      />
    </>
  );
};

const CreateMultisigForm = ({
  children,
  onSubmit,
}: {
  children?: ReactNode;
  onSubmit: (data: any) => void;
}) => {
  const [currentWalletAccount, isTxnProcessing] = useMCStore((s) => [
    s.currentWalletAccount,
    s.isTxnProcessing,
  ]);

  const formMethods = useForm<ICreateMultisigFormProps>({
    defaultValues: {
      creatorName: '',
      creatorAddress: currentWalletAccount?.publicKey,
      signatories: [
        {
          name: '',
          address: '',
        },
      ],
      threshold: 1,
      accountName: '',
    },
  });

  const { handleSubmit, watch } = formMethods;

  const signatories = watch('signatories');

  const membersCount = (signatories && signatories.length + 1) ?? 0;

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
              disabled={
                isTxnProcessing || !currentWalletAccount || membersCount < 2
              }
              type='submit'>
              {`${isTxnProcessing ? 'Processing' : 'Approve and Sign'}`}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

CreateMultisigForm.Signers = Signers;
CreateMultisigForm.Threshold = SigningThreshold;
CreateMultisigForm.AccountName = AccountName;

export default CreateMultisigForm;
