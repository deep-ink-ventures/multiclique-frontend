import { Avatar, Sidebar } from '@/components';
import WalletConnect from '@/components/WalletConnect';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import AvatarImage from '@/svg/avatar.svg';
import Chevron from '@/svg/components/Chevron';
import Coins from '@/svg/components/Coins';
import DashboardIcon from '@/svg/components/Dashboard';
import SettingsIcon from '@/svg/components/Settings';
import SwitchIcon from '@/svg/components/Switch';
import CopyIcon from '@/svg/copy.svg';
import { truncateMiddle } from '@/utils';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Settings } from './Settings';
import { Transactions } from './Transactions';

type AccountTabs = 'Dashboard' | 'Assets' | 'Transactions' | 'Settings';

const TABS: { icon: ReactNode; label: AccountTabs }[] = [
  {
    icon: <DashboardIcon className='h-4 w-4 fill-black' />,
    label: 'Dashboard',
  },
  {
    icon: <Coins className='h-4 w-4 stroke-black' />,
    label: 'Assets',
  },
  {
    icon: <SwitchIcon className='h-4 w-4 fill-black' />,
    label: 'Transactions',
  },
  {
    icon: <SettingsIcon className='h-4 w-4 fill-black' />,
    label: 'Settings',
  },
];

const Account = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);
  const [currentTab, setCurrentTab] = useState<AccountTabs>('Dashboard');

  return (
    <MainLayout title='MultiClique' description=''>
      <div className='flex w-full'>
        <div className='w-1/4 shrink-0'>
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
                      src={CopyIcon}
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
                <Sidebar.MenuItem
                  key={`${index}-${tab.label}`}
                  active={currentTab === tab.label}
                  onClick={() => setCurrentTab(tab.label)}>
                  {tab.icon}
                  {tab.label}
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar>
        </div>
        <div className='grow space-y-4 p-6'>
          {currentTab === 'Dashboard' && <Transactions />}
          {currentTab === 'Settings' && <Settings />}
        </div>
      </div>
    </MainLayout>
  );
};

export default Account;
