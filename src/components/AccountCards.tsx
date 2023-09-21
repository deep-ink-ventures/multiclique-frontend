import type { Multisig } from '@/types/multisig';

import AccountCard from './AccountCard';

const AccountCards = (props: { accounts: Multisig[] }) => {
  return (
    <div className='flex w-full flex-col items-center justify-between space-y-5'>
      {props.accounts?.map((account) => {
        return <AccountCard key={account.address} account={account} />;
      })}
    </div>
  );
};

export default AccountCards;
