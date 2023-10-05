import { Accordion,PolicyAddressesForm,TransactionBadge } from '@/components';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import { usePromise } from '@/hooks/usePromise';
import { AccountService } from '@/services';
import useMCStore from '@/stores/MCStore';
import type { Signatory } from '@/types/multisig';
import cn from 'classnames';
import { useState } from 'react';
import { FormProvider,useForm } from 'react-hook-form';

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

const Settings = () => {
  const [accountPage] = useMCStore((s) => [s.pages.account]);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState(
    SettingsTabs.at(0)?.id
  );

  // @ts-ignore
  const updateSigner = usePromise({
    promiseFunction: async (signer: Signatory, isRemoval?: boolean) => {
      if (accountPage.multisig.data?.address != null) {
        const response = await AccountService.createMultiCliqueAccount({
          ...accountPage.multisig.data,
          signatories: isRemoval
            ? (accountPage.multisig.data.signatories ?? []).filter(
                (signerAddress) =>
                  signerAddress.address.toLowerCase() ===
                  signer.address.toLowerCase()
              )
            : [...(accountPage.multisig.data.signatories ?? []), signer],
        });
        return response;
      }
      return null;
    },
  });

  const handleSubmitAddSigner = async (newSigner: Signatory) => {
    // Uncomment after adding onchain data update
    // await updateSigner.call(newSigner, false);
    // if (accountPage.multisig.data?.address) {
    //   accountPage.multisig.getMultisigAccount(
    //     accountPage.multisig.data?.address
    //   );
    // }
  };

  const handleSubmitRemoveSigner = async (removeSigner: Signatory) => {
    // Uncomment after adding onchain data update
    // await updateSigner.call(removeSigner, true);
    // if (accountPage.multisig.data?.address) {
    //   accountPage.multisig.getMultisigAccount(
    //     accountPage.multisig.data?.address
    //   );
    // }
  };

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
        <CreateMultisigForm
          onSubmit={(data) => {
            handleSubmitAddSigner(data.signatories?.[0]);
          }}>
          <CreateMultisigForm.Signers
            title='Add a Signer'
            subtitle=''
            disableCreator
            maxSignatories={1}
            minSignatories={1}
          />
        </CreateMultisigForm>
      </div>

      <div
        className={cn('!mt-0 space-y-3 rounded-lg bg-base-200 p-4', {
          hidden: activeSettingsTab !== SettingsTabs.at(1)?.id,
        })}>
        <CreateMultisigForm
          onSubmit={(data) => {
            handleSubmitRemoveSigner(data.signatories?.[0]);
          }}>
          <CreateMultisigForm.Signers
            title='Remove a Signer'
            subtitle=''
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
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                  color='base'
                  expanded={index === activeAccordion}>
                  <Accordion.Header className='flex gap-2 text-sm'>
                    <div className='grow font-semibold'>{'{Policy Name}'}</div>
                    <TransactionBadge status='Active' />
                  </Accordion.Header>
                  <Accordion.Content className='flex'>
                    <PolicyForm formName={`${index}`} />
                  </Accordion.Content>
                </Accordion.Container>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Settings;
