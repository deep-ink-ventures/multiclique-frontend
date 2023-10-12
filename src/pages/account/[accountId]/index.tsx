import { Avatar, Sidebar } from '@/components';
import ConnectWallet from '@/components/ConnectWallet';
import WalletConnect from '@/components/WalletConnect';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
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
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Settings from '../../../components/Settings';
import Transactions from '../../../components/Transactions';

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
  const router = useRouter();
  const { accountId } = router.query;
  const [currentWalletAccount, accountPage] = useMCStore((s) => [
    s.currentWalletAccount,
    s.pages.account,
  ]);
  const [currentTab, setCurrentTab] = useState<AccountTabs>('Dashboard');

  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  useEffect(() => {
    if (accountId) {
      accountPage.multisig.getMultisigAccount(accountId.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  useEffect(() => {
    if (accountPage.multisig.failed) {
      // router.push('/'); Uncomment to guard page for invalid addresses in URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountPage.multisig.failed]);

  return (
    <MainLayout title='MultiClique' description=''>
      {currentWalletAccount?.publicKey ? (
        <div className='flex w-full'>
          <div className='w-1/4 shrink-0'>
            <Sidebar>
              <Sidebar.Content>
                <Avatar src={AvatarImage} />
                {accountPage.multisig.data?.address && (
                  <>
                    <div className='mx-auto flex w-1/2'>
                      <span className='hidden' ref={textRef}>
                        {accountPage.multisig.data?.address?.toString()}
                      </span>
                      <div className='inline-block grow truncate text-center'>
                        {truncateMiddle(
                          accountPage.multisig.data?.address?.toString(),
                          5,
                          3
                        )}
                      </div>
                      <Image
                        src={CopyIcon}
                        height={15}
                        width={15}
                        alt='copy'
                        className='cursor-pointer'
                        onClick={copyToClipboard}
                      />
                    </div>
                    <div className='flex w-full items-center rounded-lg bg-base-300 p-4'>
                      <div className='flex-col'>
                        <div className='text-xs'>XLM Tokens</div>
                        {/* TODO: map balance */}
                        <div className='font-semibold'>10,000</div>
                      </div>
                      <Chevron className='ml-auto h-4 w-4 cursor-pointer fill-black' />
                    </div>
                  </>
                )}
                {!currentWalletAccount?.publicKey && (
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
            {currentTab === 'Transactions' && (
              <Transactions address={accountId?.toString()} />
            )}
            {currentTab === 'Settings' && (
              <Settings accountId={accountId as string} />
            )}
          </div>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </MainLayout>
  );
};

export default Account;
