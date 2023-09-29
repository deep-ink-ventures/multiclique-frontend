import { Avatar,Sidebar } from '@/components';
import ConnectWallet from '@/components/ConnectWallet';
import WalletConnect from '@/components/WalletConnect';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { usePromise } from '@/hooks/usePromise';
import { MainLayout } from '@/layouts';
import { AccountService } from '@/services';
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
import { useEffect,useState } from 'react';
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
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);
  const [currentTab, setCurrentTab] = useState<AccountTabs>('Dashboard');

  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const getMultiCliqueAccount = usePromise({
    promiseFunction: async (address: string) => {
      const response = await AccountService.getMultiCliqueAccount(address);
      return response;
    },
  });

  useEffect(() => {
    if (accountId) {
      getMultiCliqueAccount.call(accountId.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  useEffect(() => {
    if (!getMultiCliqueAccount.pending && !getMultiCliqueAccount.value) {
      // router.push('/'); Uncomment to guard page for invalid addresses in URL
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMultiCliqueAccount.value]);

  return (
    <MainLayout title='MultiClique' description=''>
      {currentAccount?.publicKey ? (
        <div className='flex w-full'>
          <div className='w-1/4 shrink-0'>
            <Sidebar>
              <Sidebar.Content>
                <Avatar src={AvatarImage} />
                {getMultiCliqueAccount.value?.address && (
                  <>
                    <div className='mx-auto flex w-1/2'>
                      <div
                        className='inline-block grow truncate text-center'
                        ref={textRef}>
                        {truncateMiddle(
                          getMultiCliqueAccount.value?.address?.toString(),
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
            {currentTab === 'Dashboard' && (
              <Transactions address={accountId?.toString()} />
            )}
            {currentTab === 'Settings' && <Settings />}
          </div>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </MainLayout>
  );
};

export default Account;
