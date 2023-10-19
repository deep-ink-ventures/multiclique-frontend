import { PolicyAddressesForm } from '@/components';
import { ErrorMessage } from '@hookform/error-message';
// import useMC from '@/hooks/useMC';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
// import useMCStore from '@/stores/MCStore';

interface PolicyFormValues {
  [x: string]: {
    address: string | null;
  }[];
}

export type PolicyFormType = 'ELIO_DAO';

interface PolicyFormProps {
  formType?: PolicyFormType;
  formName: string;
  accountId: string;
}

export type ExtendedElioPolicyFormValues<Generic extends string> = {
  [Key in keyof ElioPolicyFormValues as `${Generic}${Capitalize<
    string & Key
  >}`]: string;
};

type ElioPolicyFormValues = {
  ElioCore: string;
  ElioVotes: string;
  ElioAssets?: string;
};

const ElioDAOPolicyForm = (props: {
  disabled?: boolean;
  formName: string;
  onSubmit?: (data: any) => Promise<boolean> | boolean;
}) => {
  const { disabled, formName, onSubmit } = props;

  const formMethods = useForm<PolicyFormValues>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;

  const handleOnSubmit: SubmitHandler<PolicyFormValues> = async (data) => {
    if (onSubmit) {
      const isSuccess = await onSubmit(data);
      if (isSuccess === true) {
        reset();
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className='flex w-full flex-col items-center justify-center gap-2 p-4'>
        <div className='w-full space-y-4 '>
          <div className='w-full '>
            <p className='ml-1'>Core</p>
            <input
              type='text'
              placeholder='Contract Address'
              className='input input-primary'
              disabled={disabled}
              {...register(`${formName}ElioCore`, {
                required: 'Required',
              })}
            />
            <ErrorMessage
              errors={errors}
              name={`${formName}ElioCore`}
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error-content'>{message}</p>
              )}
            />
          </div>
          <div className='w-full '>
            <p className='ml-1'>Votes</p>
            <input
              type='text'
              placeholder='Contract Address'
              className='input input-primary'
              disabled={disabled}
              {...register(`${formName}ElioVotes`, {
                required: 'Required',
              })}
            />
            <ErrorMessage
              errors={errors}
              name={`${formName}ElioVotes`}
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error-content'>{message}</p>
              )}
            />
          </div>
          <div className='w-full'>
            <p className='ml-1'>Assets</p>
            <input
              type='text'
              placeholder='Contract Address'
              className='input input-primary'
              disabled={disabled}
              {...register(`${formName}ElioAssets`)}
            />
            <ErrorMessage
              errors={errors}
              name={`${formName}ElioAssets`}
              render={({ message }) => (
                <p className='ml-2 mt-1 text-error-content'>{message}</p>
              )}
            />
          </div>
        </div>
        <button className='btn btn-primary ml-auto w-full max-w-[20%] flex-1 self-end truncate'>
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

const PolicyForm = (props: PolicyFormProps) => {
  // const {attachPolicy, installPolicyContract, initMulticliquePolicy} = useMC();

  // const [currentWalletAccount, mcAccount] = useMCStore((s) => [s.currentWalletAccount, s.pages.account]);

  const formMethods = useForm<PolicyFormValues>({
    defaultValues: {
      [`${props.formName}`]: [
        {
          address: '',
        },
      ],
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<PolicyFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col items-center justify-center gap-2'>
        <PolicyAddressesForm formName={props.formName} />
        <button className='btn btn-primary ml-auto w-full max-w-[20%] flex-1 self-end truncate'>
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

PolicyForm.ELIODAO = ElioDAOPolicyForm;

export default PolicyForm;
