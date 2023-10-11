import { PolicyAddressesForm } from '@/components';
import { ErrorMessage } from '@hookform/error-message';
// import useMC from '@/hooks/useMC';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
// import useMCStore from '@/stores/MCStore';

interface PolicyFormValues {
  [x: string]: {
    address: string;
  }[];
}

export type PolicyFormType = 'ELIO_DAO';

interface PolicyFormProps {
  formType?: PolicyFormType;
  formName: string;
  accountId: string;
}

const ElioDAOPolicyForm = (props: { disabled?: boolean; formName: string }) => {
  const { disabled, formName } = props;

  const formMethods = useForm<PolicyFormValues>({
    defaultValues: {
      [`${props.formName}`]: [
        {
          address: '',
        },
      ],
    },
  });
  const {
    register,
    formState: { errors },
  } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <div className='w-full space-y-4 p-2'>
        <div className=' w-full px-4'>
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
        <div className=' w-full px-4'>
          <p className='ml-1'>Assets</p>
          <input
            type='text'
            placeholder='Contract Address'
            className='input input-primary'
            disabled={disabled}
            {...register(`${formName}ElioAssets`, {
              required: 'Required',
            })}
          />
          <ErrorMessage
            errors={errors}
            name={`${formName}ElioAssets`}
            render={({ message }) => (
              <p className='ml-2 mt-1 text-error-content'>{message}</p>
            )}
          />
        </div>
        <div className=' w-full px-4'>
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
      </div>
    </FormProvider>
  );
};

const PolicyForm = (props: PolicyFormProps) => {
  // const {attachPolicy, installPolicyContract, initMulticliquePolicy} = useMC();

  // const [currentAccount, mcAccount] = useMCStore((s) => [s.currentAccount, s.pages.account]);

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
