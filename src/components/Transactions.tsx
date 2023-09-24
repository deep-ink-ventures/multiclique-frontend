import { Accordion, Timeline, TransactionBadge, UserTally } from '@/components';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import Copy from '@/svg/components/Copy';
import Search from '@/svg/components/Search';
import { truncateMiddle } from '@/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

const Transactions = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const mockCurrentStep = Math.floor(Math.random() * 4);

  return (
    <>
      <div className='flex items-center'>
        <div className='text-2xl font-semibold'>Transactions</div>
        <div className='relative ml-auto'>
          <Search className='absolute inset-y-0 left-2 my-auto h-4 w-4 fill-black' />
          <input
            className='my-auto rounded-lg px-3 py-2 pl-8 text-sm'
            placeholder='Search'
          />
        </div>
      </div>
      <div className='space-y-3'>
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
                  <div className='grow font-semibold'>{'{Activity Name}'}</div>
                  <div>
                    {dayjs('Jan 1, 2023').format('MMMM D, YYYY - h:mm:ss A')}
                  </div>
                  <UserTally value={index} over={10} />
                  <TransactionBadge status='Active' />
                </Accordion.Header>
                <Accordion.Content className='flex divide-x'>
                  <div className='w-2/3 px-2 pr-4'>
                    <div className='flex items-center gap-2'>
                      <div className='shrink-0 font-semibold'>Call hash:</div>
                      <div ref={textRef}>
                        {truncateMiddle(
                          '0x6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345',
                          16,
                          3
                        )}
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
                            {...(stepIndex <= mockCurrentStep && {
                              status:
                                stepIndex === mockCurrentStep
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
                      <button className='btn btn-primary flex-1'>
                        Approve
                      </button>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Container>
            );
          })}
      </div>
    </>
  );
};

export default Transactions;
