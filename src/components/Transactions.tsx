import {
  Accordion,
  EmptyPlaceholder,
  LoadingPlaceholder,
  Pagination,
  Timeline,
  TransactionBadge,
  UserTally,
} from '@/components';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDebounce } from '@/hooks/useDebounce';
import useMC from '@/hooks/useMC';
import { usePromise } from '@/hooks/usePromise';
import type { ListMultiCliqueTransactionsParams } from '@/services';
import { TransactionService } from '@/services';
import useMCStore from '@/stores/MCStore';
import Copy from '@/svg/components/Copy';
import Search from '@/svg/components/Search';
import type { JwtToken } from '@/types/auth';
import type { MultisigTransaction } from '@/types/multisigTransaction';
import { MultiSigTransactionStatus } from '@/types/multisigTransaction';
import { truncateMiddle } from '@/utils';
import dayjs from 'dayjs';
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
  [MultiSigTransactionStatus.Executable]: 'Active',
  [MultiSigTransactionStatus.Pending]: 'Pending',
  [MultiSigTransactionStatus.Executed]: 'Approved',
  [MultiSigTransactionStatus.Rejected]: 'Cancelled',
};

const Transactions = ({ address }: ITransactionsProps) => {
  const [jwt, handleErrors] = useMCStore((s) => [s.jwt, s.handleErrors]);
  const { approveTxnDB, getJwtToken, rejectTxnDB, executeMCTxn } = useMC();

  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const listTransactions = usePromise({
    promiseFunction: async (
      params: ListMultiCliqueTransactionsParams,
      jwtToken: JwtToken
    ) => {
      const response = await TransactionService.listMultiCliqueTransactions(
        params,
        jwtToken
      );
      return response;
    },
  });

  useEffect(() => {
    // fixme - change when we have a new jwt feature
    if (address && jwt) {
      console.log('get txns');
      listTransactions.call(
        {
          offset: Math.max(pagination.offset - 1, 0),
          limit: 5,
          search: debouncedSearchTerm,
        },
        jwt
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, debouncedSearchTerm, JSON.stringify(pagination), jwt]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleLoadTransactions = async () => {
    if (address) {
      await getJwtToken(address);
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
      if (address && jwt) {
        listTransactions.call(
          {
            offset: Math.max(pagination.offset - 1, 0),
            limit: 5,
            search: debouncedSearchTerm,
          },
          jwt
        );
      }
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
      if (address && jwt) {
        listTransactions.call(
          {
            offset: Math.max(pagination.offset - 1, 0),
            limit: 5,
            search: debouncedSearchTerm,
          },
          jwt
        );
      }
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
      if (address && jwt) {
        listTransactions.call(
          {
            offset: Math.max(pagination.offset - 1, 0),
            limit: 5,
            search: debouncedSearchTerm,
            ordering: 'updated_at',
          },
          jwt
        );
      }
    } catch {
      handleErrors('Error in approving transaction');
    }
  };

  const displayButtons = (mcTxn: MultisigTransaction) => {
    switch (mcTxn.status) {
      case 'EXECUTABLE':
        return (
          <div>
            <button
              className='btn btn-outline flex-1'
              onClick={() => {
                handleExecute(mcTxn);
              }}>
              Execute
            </button>
          </div>
        );

      case 'PENDING':
        return (
          <div className='flex w-full gap-2'>
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
            {listTransactions.pending && <LoadingPlaceholder />}
            {!listTransactions.pending &&
              listTransactions.fulfilled &&
              !listTransactions.value?.results?.length && <EmptyPlaceholder />}
            {!listTransactions.pending &&
              listTransactions?.value?.results?.map((mcTxn, index) => {
                console.log('mcTxn', mcTxn);
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
                      <div>
                        {dayjs(mcTxn.createdAt).format(
                          'MMMM D, YYYY - h:mm:ss A'
                        )}
                      </div>
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
                        <div className='flex gap-2 text-center'>
                          <div className='shrink-0 font-semibold'>
                            Call hash:
                          </div>
                          <div className='hidden' ref={textRef}>
                            {mcTxn.preimageHash}
                          </div>
                          <div>
                            {/* TODO: update hash */}
                            {truncateMiddle(mcTxn.preimageHash, 16, 3)}
                          </div>
                          <span
                            onClick={copyToClipboard}
                            className='rounded-full p-1 hover:bg-base-200'>
                            <Copy className='h-4 w-4 cursor-pointer' />
                          </span>
                        </div>
                        <div>
                          <div>
                            <p className='font-semibold'>{mcTxn.callFunc}: </p>
                            {truncateMiddle(mcTxn.callArgs?.join(', '))}
                          </div>
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
                        <div>Can be executed once threshold is reached</div>
                        {displayButtons(mcTxn)}
                      </div>
                    </Accordion.Content>
                  </Accordion.Container>
                );
              })}
          </>
        )}
      </div>
      {!listTransactions.pending &&
        Boolean(listTransactions.value?.results?.length) && (
          <div>
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={5}
              totalCount={listTransactions.value?.count}
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
