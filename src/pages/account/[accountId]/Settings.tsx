import { Accordion,PolicyAddressesForm,TransactionBadge } from '@/components';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import { useState } from 'react';
import { FormProvider,useForm } from 'react-hook-form';

const PolicyForm = ({ formName }: { formName?: string }) => {
  const formMethods = useForm({
    defaultValues: {
      [`${formName}Addresses`]: [
        {
          address: '',
        },
      ],
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = () => {};
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleSubmit(onSubmit)();
        }}
        className='flex w-full flex-col items-center justify-center gap-2'>
        <PolicyAddressesForm formName={`${formName}Addresses`} />
        <button
          className='btn btn-primary ml-auto w-full max-w-[20%] flex-1 self-end truncate'
          onClick={() => {}}>
          Activate
        </button>
      </form>
    </FormProvider>
  );
};

export const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  return (
    <>
      <div className='flex items-center'>
        <div className='text-2xl font-semibold'>Settings</div>
      </div>
      <div className='space-y-3 rounded-lg bg-base-200 p-4'>
        <CreateMultisigForm>
          <CreateMultisigForm.Members title='Update Multisig Signers' />
          <CreateMultisigForm.Threshold />
          <div className='w-full space-y-2 p-3'>
            <h4 className='text-center'>Attach Policy</h4>
            {Array(4)
              .fill(null)
              .map((item, index) => {
                return (
                  <Accordion.Container
                    key={index}
                    id={index}
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === index ? null : index
                      )
                    }
                    color='base'
                    expanded={index === activeAccordion}>
                    <Accordion.Header className='flex gap-2 text-sm'>
                      <div className='grow font-semibold'>
                        {'{Policy Name}'}
                      </div>
                      <TransactionBadge status='Active' />
                    </Accordion.Header>
                    <Accordion.Content className='flex'>
                      <PolicyForm formName={`${index}`} />
                    </Accordion.Content>
                  </Accordion.Container>
                );
              })}
          </div>
        </CreateMultisigForm>
      </div>
    </>
  );
};
