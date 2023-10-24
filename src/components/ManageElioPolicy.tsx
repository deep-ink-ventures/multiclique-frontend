import useMCStore from '@/stores/MCStore';
import Pencil from '@/svg/components/Pencil';
import Switch from '@/svg/components/Switch';
import type { MultiCliquePolicy } from '@/types/multiCliqueAccount';
import { useState } from 'react';
import SpendLimitFormModal from './SpendLimitFormModal';

interface IManageElioPolicyProps {
  address?: string;
  policy: MultiCliquePolicy;
}

const ManageElioPolicy = ({ policy }: IManageElioPolicyProps) => {
  const [isSpendLimitModalVisible, setIsSpendLimitModalVisible] =
    useState(false);

  const [account, currentWalletAccount] = useMCStore((s) => [
    s.pages.account,
    s.currentWalletAccount,
  ]);

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
      <div className='flex text-center'>
        <div className='text-2xl font-semibold'>Manage ELIO DAO Policy</div>
      </div>
      <div className='space-y-3'>
        <>
          <div className='divide-y overflow-hidden rounded-xl border border-neutral'>
            <div className='grid grid-cols-4 gap-0 divide-x divide-y'>
              <div className='p-2'>Asset</div>
              <div className='p-2'>Limit</div>
              <div className='p-2'>Spending</div>
              <div className='p-2'>Action</div>
            </div>
            {Array(5)
              .fill(null)
              ?.map((arg, index) => (
                <div
                  key={`${index}}`}
                  className='grid grid-cols-4 gap-0 divide-x divide-y'>
                  <div className='truncate p-2'>Asset {index}</div>
                  <div className='truncate p-2'>Limit {index}</div>
                  <div className='truncate p-2'>Spending {index}</div>
                  <div className='flex gap-2 truncate p-2'>
                    <button className='group btn btn-outline flex !h-8 !min-h-[0px] gap-1 !rounded-lg bg-error-content !p-2 !px-3 text-white'>
                      <Switch className='h-full fill-white group-hover:fill-base-content' />{' '}
                      Reset
                    </button>
                    <button
                      className='btn btn-outline flex !h-8 !min-h-[0px] gap-1 !rounded-lg bg-white !p-2 !px-3'
                      onClick={() => setIsSpendLimitModalVisible(true)}>
                      <Pencil className='h-full fill-base-content' /> Update
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      </div>
      <SpendLimitFormModal
        title='Update Spend Limit'
        visible={isSpendLimitModalVisible}
        onClose={() => setIsSpendLimitModalVisible(false)}
      />
    </>
  );
};
export default ManageElioPolicy;
