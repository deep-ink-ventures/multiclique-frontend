import { Accordion, PolicyAddressesForm, TransactionBadge } from '@/components';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import cn from 'classnames';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const SettingsTabs: Array<{ id: string; label: string }> = [
  {
    id: 'addSigner',
    label: 'Add a signer',
  },
  {
    id: 'removeSigner',
    label: 'Remove a signer',
  },
  {
    id: 'threshold',
    label: 'Change the threshold',
  },
  {
    id: 'policy',
    label: 'Attach policy',
  },
];

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

// TODO: when integrating existing record, change CreateMultisigForm.Threshold minimumSigners to current signer count.
const Settings = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState(
    SettingsTabs.at(0)?.id
  );
  return (
    <>
      <div className='flex items-center'>
        <div className='text-2xl font-semibold'>Settings</div>
      </div>
      <div className=''>
        <ul
          className='flex flex-wrap text-center text-sm '
          id='signers'
          role='tablist'>
          {SettingsTabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={cn(
                  'inline-block rounded-t-lg  p-4 hover:bg-base-300',
                  {
                    'bg-base-200': activeSettingsTab === tab.id,
                  }
                )}
                onClick={() => setActiveSettingsTab(tab.id)}
                type='button'
                role='tab'>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn('!mt-0 space-y-3 rounded-lg bg-base-200 p-4', {
          hidden: activeSettingsTab !== SettingsTabs.at(0)?.id,
        })}>
        <CreateMultisigForm onSubmit={() => {}}>
          <CreateMultisigForm.Signers
            title='Add a Signer'
            subtitle=''
            disableCreator
            // TODO: set MC signatories + 1 as maxSignatories
            maxSignatories={1}
            minSignatories={1}
          />
        </CreateMultisigForm>
      </div>

      <div
        className={cn('!mt-0 space-y-3 rounded-lg bg-base-200 p-4', {
          hidden: activeSettingsTab !== SettingsTabs.at(1)?.id,
        })}>
        <CreateMultisigForm onSubmit={() => {}}>
          <CreateMultisigForm.Signers
            title='Remove a Signer'
            subtitle=''
            // TODO: set MC signatories + 1 as maxSignatories
            minSignatories={1}
            maxSignatories={1}
            disableCreator
          />
        </CreateMultisigForm>
      </div>

      <div
        className={cn('!mt-0 space-y-3 rounded-lg bg-base-200 p-4', {
          hidden: activeSettingsTab !== SettingsTabs.at(2)?.id,
        })}>
        <CreateMultisigForm onSubmit={() => {}}>
          <CreateMultisigForm.Threshold minimumSigners={2} />
        </CreateMultisigForm>
      </div>

      <div
        className={cn('!mt-0 space-y-3 rounded-lg bg-base-200 p-4', {
          hidden: activeSettingsTab !== SettingsTabs.at(3)?.id,
        })}>
        <CreateMultisigForm onSubmit={() => {}}>
          <div className='w-full space-y-2'>
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

export default Settings;