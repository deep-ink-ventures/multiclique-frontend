import { Avatar, Sidebar } from '@/components';
import ConnectWallet from '@/components/ConnectWallet';
import Dashboard from '@/components/Dashboard';
import ImportTransactionModal from '@/components/ImportTransactionModal';
import ManageElioPolicy from '@/components/ManageElioPolicy';
import Settings from '@/components/Settings';
import Transactions from '@/components/Transactions';
import WalletConnect from '@/components/WalletConnect';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { MainLayout } from '@/layouts';
import useMCStore from '@/stores/MCStore';
import AvatarImage from '@/svg/avatar.svg';
import Chevron from '@/svg/components/Chevron';
import DashboardIcon from '@/svg/components/Dashboard';
import Proposal from '@/svg/components/Proposal';
import SettingsIcon from '@/svg/components/Settings';
import SwitchIcon from '@/svg/components/Switch';
import CopyIcon from '@/svg/copy.svg';
import { truncateMiddle } from '@/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

type AccountTabs =
  | 'Dashboard'
  | 'Assets'
  | 'Transactions'
  | 'Settings'
  | 'Manage ELIO DAO Policy';

const Account = () => {
  const router = useRouter();
  const { accountId } = router.query;
  const [currentWalletAccount, accountPage, updateJwt, multicliqueAccount] =
    useMCStore((s) => [
      s.currentWalletAccount,
      s.pages.account,
      s.updateJwt,
      s.pages.account,
    ]);
  const [currentTab, setCurrentTab] = useState<AccountTabs>('Transactions');
  const [isImportXdrVisible, setIsImportXdrVisible] = useState(false);

  const { textRef, copyToClipboard } = useCopyToClipboard<HTMLDivElement>();

  const badgeCount = useMemo(() => {
    return multicliqueAccount?.transactions?.data?.results.filter((txn) => {
      return txn.status === 'PENDING' || txn.status === 'EXECUTABLE';
    }).length;
  }, [multicliqueAccount.transactions.data]);

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

  useEffect(() => {
    return () => {
      updateJwt(null);
      multicliqueAccount.transactions.clear();
    };
  }, []);

  const TABS: {
    icon: ReactNode;
    label: AccountTabs;
    badgeCount?: number | null;
  }[] = useMemo(
    () => [
      {
        icon: <DashboardIcon className='h-4 w-4 fill-black' />,
        label: 'Dashboard',
      },
      // {
      //   icon: <Coins className='h-4 w-4 stroke-black' />,
      //   label: 'Assets',
      // },
      {
        icon: <SwitchIcon className='h-4 w-4 fill-black' />,
        label: 'Transactions',
        badgeCount: badgeCount || null,
      },
      {
        icon: <Proposal className='h-4 w-4 fill-black' />,
        label: 'Manage ELIO DAO Policy',
      },
      {
        icon: <SettingsIcon className='h-4 w-4 fill-black' />,
        label: 'Settings',
      },
    ],
    [multicliqueAccount.transactions.data]
  );

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
                    {tab.badgeCount && (
                      <span className='ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-error-content p-2 text-sm text-white'>
                        {tab.badgeCount}
                      </span>
                    )}
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar>
          </div>
          <div className='flex grow flex-col gap-4 p-6'>
            {currentTab === 'Dashboard' && <Dashboard />}
            {currentTab === 'Transactions' && (
              <Transactions address={accountId?.toString()} />
            )}
            {currentTab === 'Settings' && (
              <Settings accountId={accountId as string} />
            )}
            {accountPage.multisig.data?.policy.name === 'ELIO_DAO' &&
              currentTab === 'Manage ELIO DAO Policy' && (
                <ManageElioPolicy policy={accountPage.multisig.data.policy} />
              )}
          </div>
          <div className='fixed bottom-[2%] right-[2%]'>
            <button
              onClick={() => setIsImportXdrVisible(true)}
              className='flex h-12 w-12 items-center justify-center rounded-full bg-primary p-4 text-2xl text-white transition ease-in-out hover:rotate-180'>
              +
            </button>
          </div>
          <ImportTransactionModal
            isVisible={isImportXdrVisible}
            accountId={accountId?.toString()}
            onClose={() => setIsImportXdrVisible(false)}
          />
        </div>
      ) : (
        <ConnectWallet />
      )}
    </MainLayout>
  );
};

export default Account;
