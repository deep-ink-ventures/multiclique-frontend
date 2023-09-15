import { Accordion, Timeline, TransactionBadge, UserTally } from '@/components';
import Search from '@/svg/components/Search';
import dayjs from 'dayjs';
import { useState } from 'react';

export const Transactions = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

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
                  <div className='w-2/3'>Test Content</div>
                  <div className='grow space-y-2 px-3'>
                    <Timeline>
                      {['Created', 'Approval', 'Approved', 'Executed'].map(
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
