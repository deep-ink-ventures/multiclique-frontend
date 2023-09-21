import type { Multisig } from '@/types/multisig';
import { truncateMiddle } from '@/utils';
import Link from 'next/link';

const AccountCard = ({ account }: { account: Multisig }) => {
  return (
    <Link
      href={`/account/${account.address}`}
      className='flex h-[56px] w-full items-center justify-between rounded-xl border-[0.5px] border-neutral bg-base-100 px-2 text-sm shadow-lg hover:outline hover:cursor-pointer hover:outline-primary'>
      <div>{account.name}</div>
      <div>{truncateMiddle(account.address)}</div>
      <div>{`${account.signatories.length} Signatories`}</div>
    </Link>
  );
};

export default AccountCard;
