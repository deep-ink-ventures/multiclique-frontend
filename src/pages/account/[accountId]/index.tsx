import {
Accordion,
Avatar,
Sidebar,
Timeline,
TransactionBadge,
UserTally,
} from '@/components';
import WalletConnect from '@/components/WalletConnect';
import useMCStore from '@/stores/MCStore';
import AvatarImage from '@/svg/avatar.svg';
import Chevron from '@/svg/components/Chevron';
import Coins from '@/svg/components/Coins';
import Dashboard from '@/svg/components/Dashboard';
import Search from '@/svg/components/Search';
import Settings from '@/svg/components/Settings';
import Switch from '@/svg/components/Switch';
import Copy from '@/svg/copy.svg';
import { truncateMiddle } from '@/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';

const TABS = [
  {
    icon: <Dashboard className='h-4 w-4 fill-black' />,
    label: 'Dashboard',
  },
  {
    icon: <Coins className='h-4 w-4 stroke-black' />,
    label: 'Assets',
  },
  {
    icon: <Switch className='h-4 w-4 fill-black' />,
    label: 'Transactions',
  },
  {
    icon: <Settings className='h-4 w-4 fill-black' />,
    label: 'Settings',
  },
];

const Account = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);

  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const mockCurrentStep = Math.floor(Math.random() * 4);

  return (
    <div className='flex w-full'>
      <div className='w-1/4'>
        <Sidebar>
          <Sidebar.Content>
            <Avatar src={AvatarImage} />
            {currentAccount?.publicKey && (
              <>
                <div className='mx-auto flex w-1/2'>
                  <div className='inline-block grow truncate text-center'>
                    {truncateMiddle(currentAccount.publicKey, 5, 3)}
                  </div>
                  <Image
                    src={Copy}
                    height={15}
                    width={15}
                    alt='copy'
                    className='cursor-pointer'
                  />
                </div>
                <div className='flex w-full items-center rounded-lg bg-base-300 p-4'>
                  <div className='flex-col'>
                    <div className='text-xs'>XLM Tokens</div>
                    <div className='font-semibold'>10,000</div>
                  </div>
                  <Chevron className='ml-auto h-4 w-4 cursor-pointer fill-black' />
                </div>
              </>
            )}
            {!currentAccount?.publicKey && (
              <WalletConnect text='Connect your wallet' />
            )}
          </Sidebar.Content>
          <Sidebar.Menu>
            {TABS.map((tab, index) => (
              <Sidebar.MenuItem key={`${index}-${tab.label}`}>
                {tab.icon}
                {tab.label}
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar>
      </div>
      <div className='grow space-y-4 p-6'>
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
              const mockStatus = ['base', 'warning', 'success', 'danger'][
                Math.floor(Math.random() * 4)
              ] as any;
              const mockBadgeStatus: Record<string, any> = {
                base: 'Active',
                warning: 'Pending',
                success: 'Approved',
                danger: 'Cancelled',
              };
              return (
                <Accordion.Container
                  key={index}
                  id={index}
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                  color={mockStatus}
                  expanded={index === activeAccordion}>
                  <Accordion.Header className='flex gap-2 text-sm'>
                    <div className='grow font-semibold'>
                      {'{Activity Name}'}
                    </div>
                    <div>{dayjs().format('MMMM D, YYYY - h:mm:ss A')}</div>
                    <UserTally value={index} over={10} />
                    <TransactionBadge
                      status={
                        mockStatus && (mockBadgeStatus[mockStatus] as any)
                      }
                    />
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
                        <button className='btn btn-outline flex-1'>
                          Reject
                        </button>
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
      </div>
    </div>
  );
};

export default Account;
