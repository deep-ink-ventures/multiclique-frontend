import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import useMCStore from '@/stores/MCStore';
import Pencil from '@/svg/components/Pencil';
import CopyIcon from '@/svg/copy.svg';
import type {
  MultiCliqueContract,
  MultiCliquePolicy,
} from '@/types/multiCliqueAccount';
import { truncateMiddle, uiTokens } from '@/utils';
import Image from 'next/image';
import { useState } from 'react';
import { EmptyPlaceholder } from '.';
import SpendLimitFormModal from './SpendLimitFormModal';

interface IManageElioPolicyProps {
  policy: MultiCliquePolicy;
}

const ManageElioPolicy = ({ policy }: IManageElioPolicyProps) => {
  const [selectedContract, setSelectedContract] =
    useState<MultiCliqueContract | null>(null);
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

  const ClipboardControl = ({ text }: any) => {
    const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();
    return (
      <>
        <span className='hidden' ref={textRef}>
          {text}
        </span>
        <Image
          src={CopyIcon}
          height={15}
          width={15}
          alt='copy'
          className='cursor-pointer'
          onClick={copyToClipboard}
        />
      </>
    );
  };

  const handleUpdateClick = (contract: MultiCliqueContract) => {
    setIsSpendLimitModalVisible(true);
    setSelectedContract(contract);
  };

  return (
    <>
      <div className='flex text-center'>
        <div className='text-2xl font-semibold'>Manage ELIO DAO Policy</div>
      </div>
      <div className='space-y-3'>
        <>
          <div className='divide-y overflow-hidden rounded-xl border border-neutral'>
            <div className='grid grid-cols-5 gap-0 divide-x divide-y'>
              <div className='p-2'>Address</div>
              <div className='p-2'>Type</div>
              <div className='p-2'>Limit</div>
              <div className='p-2'>Spent</div>
              <div className='p-2'>Action</div>
            </div>
            {!policy.contracts?.length && <EmptyPlaceholder />}
            {policy.contracts?.map((contract, index) => (
              <div
                key={contract.address + index.toString()}
                className='grid grid-cols-5 gap-0 divide-x divide-y'>
                <div className='flex items-center justify-between truncate p-2'>
                  {truncateMiddle(contract.address)}
                  <ClipboardControl text={contract.address} />
                </div>
                <div className='truncate p-2'>{contract.type}</div>
                <div className='truncate p-2'>
                  {uiTokens(contract.limit, 'dao')}
                </div>
                <div className='truncate p-2'>
                  {' '}
                  {uiTokens(contract.alreadySpent, 'dao')}
                </div>
                <div className='flex gap-2 truncate p-2'>
                  <button
                    className='btn btn-outline flex !h-8 !min-h-[0px] gap-1 !rounded-lg bg-white !p-2 !px-3'
                    onClick={() => {
                      handleUpdateClick(contract);
                    }}>
                    <Pencil className='h-full fill-base-content' /> Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
      <SpendLimitFormModal
        policyAddress={policy.address}
        assetContractAddress={selectedContract?.address || ''}
        title='Update Spend Limit'
        visible={isSpendLimitModalVisible}
        onClose={() => setIsSpendLimitModalVisible(false)}
      />
    </>
  );
};
export default ManageElioPolicy;
