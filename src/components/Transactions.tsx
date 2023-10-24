import {
  Accordion,
  EmptyPlaceholder,
  LoadingPlaceholder,
  Pagination,
  Timeline,
  TransactionBadge,
  UserTally,
} from '@/components';
import { useDebounce } from '@/hooks/useDebounce';
import useMC from '@/hooks/useMC';
import useMCStore from '@/stores/MCStore';
import Search from '@/svg/components/Search';
import type { JwtToken } from '@/types/auth';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import { MultiSigTransactionStatus } from '@/types/multisigTransaction';
import { formatDateTime, truncateMiddle } from '@/utils';
import { useEffect, useState } from 'react';

interface ITransactionsProps {
  address?: string;
}

const StatusStepMap: Record<MultiSigTransactionStatus, number> = {
  [MultiSigTransactionStatus.Rejected]: 0,
  [MultiSigTransactionStatus.Pending]: 1,
  [MultiSigTransactionStatus.Executable]: 2,
  [MultiSigTransactionStatus.Executed]: 3,
};

const StatusBadgeMap: Record<MultiSigTransactionStatus, string> = {
  [MultiSigTransactionStatus.Executable]: 'EXECUTABLE',
  [MultiSigTransactionStatus.Pending]: 'PENDING',
  [MultiSigTransactionStatus.Executed]: 'EXECUTED',
  [MultiSigTransactionStatus.Rejected]: 'REJECTED',
};

const Transactions = ({ address }: ITransactionsProps) => {
  const [jwt, handleErrors, account, currentWalletAccount] = useMCStore((s) => [
    s.jwt,
    s.handleErrors,
    s.pages.account,
    s.currentWalletAccount,
  ]);
  const { approveTxnDB, getJwtToken, rejectTxnDB, executeMCTxn } = useMC();

  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  // const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const fetchTransactions = (jwtToken?: JwtToken | null) => {
    if (jwtToken) {
      account.transactions.getMultisigTransaction(
        {
          offset: Math.max(pagination.offset - 1, 0),
          limit: 10,
          search: debouncedSearchTerm,
          ordering: 'updated_at',
        },
        jwtToken
      );
    }
  };

  useEffect(() => {
    // fixme - change when we have a new jwt feature
    if (address && jwt) {
      fetchTransactions(jwt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, debouncedSearchTerm, JSON.stringify(pagination)]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleLoadTransactions = async () => {
    if (address) {
      const newJwt = await getJwtToken(address);
      fetchTransactions(newJwt);
    }
  };

  const handleApprove = async (txn: MultisigTransaction) => {
    if (!jwt) {
      return;
    }

    try {
      await approveTxnDB(txn, jwt);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      fetchTransactions(jwt);
    } catch {
      handleErrors('Error in approving transaction');
    }
  };

  const handleReject = async (txn: MultisigTransaction) => {
    if (!jwt) {
      return;
    }

    try {
      await rejectTxnDB(txn, jwt);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      fetchTransactions(jwt);
    } catch {
      handleErrors('Error in approving transaction');
    }
  };

  const handleExecute = async (txn: MultisigTransaction) => {
    if (!jwt) {
      return;
    }

    try {
      await executeMCTxn(txn);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      fetchTransactions(jwt);
    } catch {
      handleErrors('Error in approving transaction');
    }
  };

  const displayButtons = (mcTxn: MultisigTransaction) => {
    switch (mcTxn.status) {
      case 'EXECUTABLE':
        return (
          <div className='flex w-full justify-center'>
            <button
              className='btn btn-primary min-w-[60%]'
              onClick={() => {
                handleExecute(mcTxn);
              }}>
              Execute
            </button>
          </div>
        );

      case 'PENDING':
        return (
          <div className='flex w-full justify-center gap-2'>
            <button
              className='btn btn-outline flex-1'
              onClick={() => {
                handleReject(mcTxn);
              }}>
              Reject
            </button>
            <button
              className='btn btn-primary flex-1'
              onClick={() => {
                handleApprove(mcTxn);
              }}>
              Approve
            </button>
          </div>
        );

      case 'EXECUTED':
        return null;

      case 'REJECTED':
        return null;

      default:
        return null;
    }
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
      <div className='flex text-center'>
        <div className='text-2xl font-semibold'>Transactions</div>
        <div className='relative ml-auto'>
          <Search className='absolute inset-y-0 left-2 my-auto h-4 w-4 fill-black' />
          <input
            className='my-auto rounded-lg px-3 py-2 pl-8 text-sm'
            placeholder='Search'
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className='space-y-3'>
        {!jwt && (
          <EmptyPlaceholder
            label={
              <div className='flex w-full flex-col justify-center space-y-2 text-center'>
                <div>
                  At the moment, we require users to authenticate to view
                  transactions
                </div>
                <button
                  className='btn btn-primary'
                  onClick={handleLoadTransactions}>
                  Load Transactions
                </button>
              </div>
            }
          />
        )}
        {jwt && (
          <>
            {account.transactions.loading && <LoadingPlaceholder />}
            {!account.transactions.loading &&
              account.transactions.fulfilled &&
              !account.transactions.data?.results?.length && (
                <EmptyPlaceholder />
              )}
            {!account.transactions.loading &&
              account.transactions.data?.results?.map((mcTxn, index) => {
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
                      <div className='grow font-semibold'>{mcTxn.callFunc}</div>
                      <div>{formatDateTime(mcTxn.createdAt)}</div>
                      <UserTally
                        value={mcTxn.approvals?.length}
                        over={mcTxn.signatories?.length}
                      />
                      <TransactionBadge
                        status={StatusBadgeMap[mcTxn.status] as any}
                      />
                    </Accordion.Header>
                    <Accordion.Content className='flex divide-x'>
                      <div className='flex w-2/3 flex-col space-y-3 px-2 pr-4'>
                        {/* <div className='flex gap-2 text-center'>
                          <p className='shrink-0 font-semibold'>
                            Call hash:
                          </p>
                          <div className='hidden' ref={textRef}>
                            {mcTxn.preimageHash}
                          </div>
                          <div>
                            {truncateMiddle(mcTxn.preimageHash, 16, 3)}
                          </div>
                          <span
                            onClick={copyToClipboard}
                            className='rounded-full p-1 hover:bg-base-200'>
                            <Copy className='h-4 w-4 cursor-pointer' />
                          </span>
                        </div> */}
                        <div>
                          <div>
                            <p className='font-semibold'>{mcTxn.callFunc}: </p>
                            {mcTxn.callArgs
                              ?.map((item: any) => {
                                return truncateMiddle(item.toString());
                              })
                              .join(', ')}
                          </div>
                        </div>
                        <div>
                          <p className='font-semibold'>Created at: </p>
                          {formatDateTime(mcTxn.createdAt)}
                        </div>
                        <div>
                          <p className='font-semibold'>Updated at: </p>
                          {formatDateTime(mcTxn.updatedAt)}
                        </div>
                        <div>
                          <p className='font-semibold'>Executed at: </p>
                          {formatDateTime(mcTxn.executedAt)}
                        </div>
                      </div>
                      <div className='grow space-y-2 px-3'>
                        <Timeline>
                          {['Pending', 'Executable', 'Executed'].map(
                            (step, stepIndex) => (
                              <Timeline.Item
                                key={`${stepIndex}-${step}`}
                                {...(stepIndex <=
                                  StatusStepMap[mcTxn.status] && {
                                  status:
                                    stepIndex === StatusStepMap[mcTxn.status]
                                      ? 'active'
                                      : 'completed',
                                })}>
                                {step}
                              </Timeline.Item>
                            )
                          )}
                        </Timeline>
                        {mcTxn.status !== 'EXECUTED' && (
                          <div>Can be executed once threshold is reached</div>
                        )}
                        <div className='flex justify-center'>
                          {displayButtons(mcTxn)}
                        </div>
                      </div>
                    </Accordion.Content>
                  </Accordion.Container>
                );
              })}
          </>
        )}
      </div>
      {!account.transactions.loading &&
        Boolean(account.transactions.data?.results?.length) && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={10}
              totalCount={account.transactions.data?.count}
              onPageChange={(newPage, newOffset) =>
                setPagination({ currentPage: newPage, offset: newOffset })
              }
            />
          </div>
        )}
    </>
  );
};
export default Transactions;
