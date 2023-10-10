import { PolicyAddressesForm } from '@/components';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

interface PolicyFormValues {
  [x: string]: {
    address: string;
  }[];
}

const PolicyForm = ({ formName }: { formName: string }) => {
  const formMethods = useForm<PolicyFormValues>({
    defaultValues: {
      [`${formName}`]: [
        {
          address: '',
        },
      ],
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<PolicyFormValues> = (data) => {
    console.log(data.formName);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col items-center justify-center gap-2'>
        <PolicyAddressesForm formName={formName} />
        <button className='btn btn-primary ml-auto w-full max-w-[20%] flex-1 self-end truncate'>
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default PolicyForm;
