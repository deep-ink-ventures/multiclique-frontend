import { Accordion,TransactionBadge } from '@/components';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import useMC from '@/hooks/useMC';
import { usePromise } from '@/hooks/usePromise';
import { AccountService } from '@/services';
import { TransactionService } from '@/services/transaction';
import useMCStore from '@/stores/MCStore';
import type { Signatory } from '@/types/multisig';
import cn from 'classnames';
import { useState } from 'react';
import PolicyForm from './PolicyForm';

enum PolicyFormAccordion {
  ELIO = 'ELIO',
}

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

const Settings = (props: { accountId: string }) => {
  const [accountPage, handleErrors] = useMCStore((s) => [
    s.pages.account,
    s.handleErrors,
  ]);
  const [activeAccordion, setActiveAccordion] =
    useState<PolicyFormAccordion | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState(
    SettingsTabs.at(0)?.id
  );
  const { makeAddSignerTxn, makeRemoveSignerTxn, getJwtToken } = useMC();
  // const useLoadingScreen = useLoadingScreenContext();

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
    try {
      const txn = await makeAddSignerTxn(props.accountId, newSigner.address);
      if (!txn) {
        return;
      }
      const jwt = await getJwtToken(props.accountId);
      if (!jwt) {
        return;
      }

      await TransactionService.createMultiCliqueTransaction(
        {
          xdr: txn?.toXDR(),
          multicliqueAddress: props.accountId,
        },
        jwt
      );
    } catch (err) {
      handleErrors('Error in adding signer', err);
    }
  };

  const handleSubmitRemoveSigner = async (signerToRemove: Signatory) => {
    try {
      const txn = await makeRemoveSignerTxn(
        props.accountId,
        signerToRemove.address
      );
      if (!txn) {
        return;
      }
      const jwt = await getJwtToken(props.accountId);
      if (!jwt) {
        return;
      }
      await TransactionService.createMultiCliqueTransaction(
        {
          xdr: txn?.toXDR(),
          multicliqueAddress: props.accountId,
        },
        jwt
      );
    } catch (err) {
      handleErrors('Error in removing signer', err);
    }
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
            disableCount={true}
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
            disableCount={true}
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
          <Accordion.Container
            id={PolicyFormAccordion.ELIO}
            onClick={() =>
              setActiveAccordion(
                activeAccordion === PolicyFormAccordion.ELIO
                  ? null
                  : PolicyFormAccordion.ELIO
              )
            }
            color='base'
            expanded={PolicyFormAccordion.ELIO === activeAccordion}>
            <Accordion.Header className='flex gap-2 text-sm'>
              <div className='grow font-semibold'>{'ELIO_DAO'}</div>
              <TransactionBadge status='Active' />
            </Accordion.Header>
            <Accordion.Content className='flex'>
              <PolicyForm.ELIODAO formName='ELIO_DAO' />
            </Accordion.Content>
          </Accordion.Container>
        </div>
      </div>
    </>
  );
};

export default Settings;
