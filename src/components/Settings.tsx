import { Accordion, TransactionBadge } from '@/components';
import CreateMultisigForm from '@/components/CreateMultisigForm';
import { useLoadingScreenContext } from '@/context/LoadingScreen';
import useMC from '@/hooks/useMC';
import { usePromise } from '@/hooks/usePromise';
import { AccountService } from '@/services';
import useMCStore, { TxnResponse } from '@/stores/MCStore';
import type { Signatory } from '@/types/multiCliqueAccount';
import cn from 'classnames';
import { useState } from 'react';
import type { ExtendedElioPolicyFormValues } from './PolicyForm';
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
  const [
    account,
    handleErrors,
    addTxnNotification,
    elioConfig,
    currentWalletAccount,
  ] = useMCStore((s) => [
    s.pages.account,
    s.handleErrors,
    s.addTxnNotification,
    s.elioConfig,
    s.currentWalletAccount,
  ]);
  const [activeAccordion, setActiveAccordion] =
    useState<PolicyFormAccordion | null>(null);
  // make this global?
  const [activeSettingsTab, setActiveSettingsTab] = useState(
    SettingsTabs.at(0)?.id
  );
  const {
    makeAddSignerTxn,
    makeRemoveSignerTxn,
    getJwtToken,
    makeChangeThresholdTxn,
    createMCTransactionDB,
    makeAttachPolicyTxn,
  } = useMC();
  const useLoadingModal = useLoadingScreenContext();

  // @ts-ignore
  const updateSigner = usePromise({
    promiseFunction: async (signer: Signatory, isRemoval?: boolean) => {
      if (account.multisig.data?.address != null) {
        const response = await AccountService.createMultiCliqueAccount({
          ...account.multisig.data,
          signatories: isRemoval
            ? (account.multisig.data.signatories ?? []).filter(
                (sig: Signatory) =>
                  sig.address.toLowerCase() === signer.address.toLowerCase()
              )
            : [...(account.multisig.data.signatories ?? []), signer],
        });
        return response;
      }
      return null;
    },
  });

  const handleChangeThreshold = async (thresholdData: {
    threshold: number;
  }) => {
    useLoadingModal.setAction({
      type: 'SHOW_TRANSACTION_PROCESSING',
    });
    try {
      const txn = await makeChangeThresholdTxn(
        props.accountId,
        Number(thresholdData.threshold)
      );
      if (!txn) {
        handleErrors('Error in making change threshold transaction');
        return;
      }
      const jwt = await getJwtToken(props.accountId);
      if (!jwt) {
        handleErrors('Error in authentication');
        return;
      }

      const response = await createMCTransactionDB(txn.toXDR(), jwt);

      if (response?.id != null) {
        addTxnNotification({
          title: 'Success',
          message: 'Change threshold transaction has been submitted',
          type: TxnResponse.Success,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      handleErrors('Error in changing threshold', err);
    } finally {
      useLoadingModal.setAction({
        type: 'CLOSE',
      });
    }
  };

  const handleSubmitAddSigner = async (newSigner: Signatory) => {
    useLoadingModal.setAction({
      type: 'SHOW_TRANSACTION_PROCESSING',
    });
    try {
      const txn = await makeAddSignerTxn(props.accountId, newSigner.address);
      if (!txn) {
        return;
      }
      const jwt = await getJwtToken(props.accountId);
      if (!jwt) {
        return;
      }

      const response = await createMCTransactionDB(txn.toXDR(), jwt);

      if (response?.id != null) {
        addTxnNotification({
          title: 'Success',
          message: 'Add a signer transaction has been submitted',
          type: TxnResponse.Success,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      handleErrors('Error in adding signer', err);
    } finally {
      useLoadingModal.setAction({
        type: 'CLOSE',
      });
    }
  };

  const handleSubmitRemoveSigner = async (signerToRemove: Signatory) => {
    useLoadingModal.setAction({
      type: 'SHOW_TRANSACTION_PROCESSING',
    });
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

      const response = await createMCTransactionDB(txn.toXDR(), jwt);

      if (response?.id != null) {
        addTxnNotification({
          title: 'Success',
          message: 'Remove a signer transaction has been submitted',
          type: TxnResponse.Success,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      handleErrors('Error in removing signer', err);
    } finally {
      useLoadingModal.setAction({
        type: 'CLOSE',
      });
    }
  };

  const handleAttachPolicy = async (
    data: ExtendedElioPolicyFormValues<'policy'>
  ) => {
    let isSuccess = false;

    if (
      !elioConfig?.coreContractAddress ||
      !account.multisig.data?.policy.address
    ) {
      return isSuccess;
    }

    useLoadingModal.setAction({
      type: 'SHOW_TRANSACTION_PROCESSING',
    });
    try {
      const addresses = Object.values(data).filter((item) => {
        return !!item;
      });
      const txn = await makeAttachPolicyTxn(
        props.accountId,
        `${account.multisig?.data?.policy.address}`,
        [...addresses]
      );
      if (!txn) {
        useLoadingModal.setAction({ type: 'CLOSE' });
        return isSuccess;
      }
      const jwt = await getJwtToken(props.accountId);
      if (!jwt) {
        useLoadingModal.setAction({ type: 'CLOSE' });
        return isSuccess;
      }
      const response = await createMCTransactionDB(txn.toXDR(), jwt);

      if (response?.id != null) {
        addTxnNotification({
          title: 'Success',
          message: 'Attach a Policy transaction has been submitted',
          type: TxnResponse.Success,
          timestamp: Date.now(),
        });
        isSuccess = true;
      }
    } catch (err) {
      handleErrors('Error in attaching policy', err);
    } finally {
      useLoadingModal.setAction({
        type: 'CLOSE',
      });
    }
    return isSuccess;
  };

  if (
    !account.multisig.data?.signatories.some(
      (signer) =>
        signer.address.toLowerCase() ===
        currentWalletAccount?.publicKey?.toLowerCase()
    )
  ) {
    return (
      <div className='flex justify-center'>
        You are not a signatory of this account
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center'>
        <div className='text-2xl font-semibold'>Settings</div>
      </div>
      <div>
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
          <CreateMultisigForm
            onSubmit={(data) => {
              handleChangeThreshold(data);
            }}>
            <CreateMultisigForm.Threshold
              minimumSigners={1}
              title={'Enter New Threshold'}
              maxSigners={account.multisig.data?.signatories.length}
            />
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
                <TransactionBadge
                  status={
                    account.multisig.data?.policy?.contracts?.length
                      ? 'ACTIVE'
                      : 'INACTIVE'
                  }
                />
              </Accordion.Header>
              <Accordion.Content className='flex'>
                <PolicyForm.ELIODAO
                  formName='policy'
                  onSubmit={handleAttachPolicy}
                />
              </Accordion.Content>
            </Accordion.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
