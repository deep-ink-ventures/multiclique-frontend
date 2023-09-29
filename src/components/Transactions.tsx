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
import { usePromise } from '@/hooks/usePromise';
import type { ListMultiCliqueTransactionsParams } from '@/services';
import { TransactionService } from '@/services';
import Copy from '@/svg/components/Copy';
import Search from '@/svg/components/Search';
import { MultiSigTransactionStatus } from '@/types/multisigTransaction';
import { truncateMiddle } from '@/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface ITransactionsProps {
  address?: string;
}

const StatusStepMap: Record<MultiSigTransactionStatus, number> = {
  [MultiSigTransactionStatus.Cancelled]: 0,
  [MultiSigTransactionStatus.Pending]: 1,
  [MultiSigTransactionStatus.Executed]: 2,
};

const Transactions = ({ address }: ITransactionsProps) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    offset: 0,
  });

  const listTransactions = usePromise({
    promiseFunction: async (params: ListMultiCliqueTransactionsParams) => {
      const response = await TransactionService.listMultiCliqueTransactions(
        params
      );
      return response;
    },
  });

  useEffect(() => {
    if (address) {
      listTransactions.call({
        offset: Math.max(pagination.offset - 1, 0),
        limit: 5,
        search: debouncedSearchTerm,
        multicliqueAccountAddress: `${address}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, debouncedSearchTerm, JSON.stringify(pagination)]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className='flex items-center'>
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
        {listTransactions.pending && <LoadingPlaceholder />}
        {!listTransactions.pending &&
          listTransactions.fulfilled &&
          !listTransactions.value?.results?.length && <EmptyPlaceholder />}
        {listTransactions?.value?.results?.map((item, index) => {
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
                <div className='grow font-semibold'>{item.callFunc}</div>
                <div>
                  {dayjs(item.createdAt).format('MMMM D, YYYY - h:mm:ss A')}
                </div>
                <UserTally
                  value={item.approvers?.length}
                  over={item.signatories?.length}
                />
                <TransactionBadge status='Active' />
              </Accordion.Header>
              <Accordion.Content className='flex divide-x'>
                <div className='w-2/3 px-2 pr-4'>
                  <div className='flex items-center gap-2'>
                    <div className='shrink-0 font-semibold'>Call hash:</div>
                    <div ref={textRef}>
                      {/* TODO: update hash */}
                      {truncateMiddle(item.preimageHash, 16, 3)}
                    </div>
                    <span
                      onClick={copyToClipboard}
                      className='rounded-full p-1 hover:bg-base-200'>
                      <Copy className='h-4 w-4 cursor-pointer' />
                    </span>
                  </div>
                </div>
                <div className='grow space-y-2 px-3'>
                  <Timeline>
                    {['Created', 'Approved', 'Executed'].map(
                      (step, stepIndex) => (
                        <Timeline.Item
                          key={`${stepIndex}-${step}`}
                          {...(stepIndex <= StatusStepMap[item.status] && {
                            status:
                              stepIndex === StatusStepMap[item.status]
                                ? 'active'
                                : 'completed',
                          })}>
                          {step}
                        </Timeline.Item>
                      )
                    )}
                  </Timeline>
                  <div>Can be executed once threshold is reached</div>
                  <div className='flex w-full gap-2'>
                    <button className='btn btn-outline flex-1'>Reject</button>
                    <button className='btn btn-primary flex-1'>Approve</button>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Container>
          );
        })}
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
