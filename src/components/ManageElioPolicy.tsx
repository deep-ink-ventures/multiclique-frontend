import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import useMC from '@/hooks/useMC';
import useMCStore from '@/stores/MCStore';
import Pencil from '@/svg/components/Pencil';
import Switch from '@/svg/components/Switch';
import CopyIcon from '@/svg/copy.svg';
import type { JwtToken } from '@/types/auth';
import type { MultiCliquePolicy } from '@/types/multiCliqueAccount';
import { truncateMiddle } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EmptyPlaceholder, LoadingPlaceholder, Pagination } from '.';
import SpendLimitFormModal from './SpendLimitFormModal';

interface IManageElioPolicyProps {
  address?: string;
  policy: MultiCliquePolicy;
}

const ManageElioPolicy = ({ address }: IManageElioPolicyProps) => {
  const [isSpendLimitModalVisible, setIsSpendLimitModalVisible] =
    useState(false);

  const [account, currentWalletAccount, jwt] = useMCStore((s) => [
    s.pages.account,
    s.currentWalletAccount,
    s.jwt,
  ]);

  const { getJwtToken } = useMC();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const fetchPolicyAssets = (jwtToken?: JwtToken | null) => {
    if (jwtToken) {
      account.assets.getPolicyAssets(
        {
          offset: Math.max(pagination.offset - 1, 0),
          limit: 10,
        },
        jwtToken
      );
    }
  };

  useEffect(() => {
    if (address && jwt) {
      fetchPolicyAssets(jwt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, JSON.stringify(pagination)]);

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

  const handleLoadTransactions = async () => {
    if (address) {
      const newJwt = await getJwtToken(address);
      fetchPolicyAssets(newJwt);
    }
  };

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

  return (
    <>
      <div className='flex text-center'>
        <div className='text-2xl font-semibold'>Manage ELIO DAO Policy</div>
      </div>
      <div className='space-y-3'>
        {!jwt && (
          <EmptyPlaceholder
            label={
              <div className='flex w-full flex-col justify-center space-y-2 text-center'>
                <div>
                  At the moment, we require users to authenticate to view assets
                </div>
                <button
                  className='btn btn-primary'
                  onClick={handleLoadTransactions}>
                  Load Assets
                </button>
              </div>
            }
          />
        )}
        {jwt && (
          <>
            {account.assets.loading && <LoadingPlaceholder />}
            {!account.assets.loading && (
              <>
                <div className='divide-y overflow-hidden rounded-xl border border-neutral'>
                  <div className='grid grid-cols-4 gap-0 divide-x divide-y'>
                    <div className='p-2'>Asset</div>
                    <div className='p-2'>Limit</div>
                    <div className='p-2'>Spending</div>
                    <div className='p-2'>Action</div>
                  </div>
                  {account.assets.data?.results?.map((asset, index) => {
                    return (
                      <div
                        key={`${index}}`}
                        className='grid grid-cols-4 gap-0 divide-x divide-y'>
                        <div className='flex items-center justify-between truncate p-2'>
                          {truncateMiddle(asset.address)}
                          <ClipboardControl text={index} />
                        </div>
                        <div className='truncate p-2'>{asset.limit}</div>
                        <div className='truncate p-2'>{asset.spending}</div>
                        <div className='flex gap-2 truncate p-2'>
                          <button
                            className='btn btn-outline flex !h-8 !min-h-[0px] gap-1 !rounded-lg bg-white !p-2 !px-3'
                            onClick={() => setIsSpendLimitModalVisible(true)}>
                            <Pencil className='h-full fill-base-content' />{' '}
                            Update
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {!account.assets.loading &&
        Boolean(account.assets.data?.results?.length) && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={10}
              totalCount={account.assets.data?.count}
              onPageChange={(newPage, newOffset) =>
                setPagination({ currentPage: newPage, offset: newOffset })
              }
            />
          </div>
        )}
      <SpendLimitFormModal
        title='Update Spend Limit'
        visible={isSpendLimitModalVisible}
        onClose={() => setIsSpendLimitModalVisible(false)}
      />
    </>
  );
};
export default ManageElioPolicy;
