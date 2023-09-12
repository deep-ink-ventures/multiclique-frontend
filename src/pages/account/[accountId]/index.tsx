import { Avatar, Sidebar } from '@/components';
import AvatarImage from '@/svg/avatar.svg';
import Chevron from '@/svg/components/Chevron';
import Coins from '@/svg/components/Coins';
import Dashboard from '@/svg/components/Dashboard';
import Search from '@/svg/components/Search';
import Settings from '@/svg/components/Settings';
import Switch from '@/svg/components/Switch';
import Copy from '@/svg/copy.svg';
import Image from 'next/image';

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
  return (
    <div className='flex w-full'>
      <div className='w-1/4'>
        <Sidebar>
          <Sidebar.Content>
            <Avatar src={AvatarImage} />
            <div className='mx-auto flex w-1/2'>
              <div className='inline-block grow truncate text-center'>
                Wallet Address
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
                <div className='text-xs'>Owned Tokens</div>
                <div className='font-semibold'>10</div>
              </div>
              <Chevron className='ml-auto h-4 w-4 cursor-pointer fill-black' />
            </div>
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
      <div className='grow p-6'>
        <div className='flex items-center'>
          <div className='text-2xl font-semibold'>Transactions</div>
          <div className='relative ml-auto '>
            <Search className='absolute inset-y-0 left-2 my-auto h-4 w-4 fill-black' />
            <input
              className='my-auto rounded-lg px-3 py-2 pl-8 text-sm'
              placeholder='Search'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
