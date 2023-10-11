import { PolicyAddressesForm } from '@/components';
// import useMC from '@/hooks/useMC';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
// import useMCStore from '@/stores/MCStore';

interface PolicyFormValues {
  [x: string]: {
    address: string;
  }[];
}

interface PolicyFormProps {
  formName: string;
  accountId: string;
}

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

export default PolicyForm;
