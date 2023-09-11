import { ConnectWallet } from '@/components/ConnectWallet';
import Link from 'next/link';

const CreateAccount = () => {
  return (
    <>
      <div className='container relative mx-auto mt-5 min-w-[600px] max-w-[820px] overflow-hidden'>
        <progress
          className='progress progress-primary absolute top-0 h-2 w-full'
          value={25}
          max={100}
        />
        <div className='mt-1 flex flex-col justify-center px-12 py-6'>
          <div className='text-xl font-semibold'>Create new account</div>
          <div className='flex w-full flex-col items-center gap-8 rounded-lg border border-base-100 p-6 py-12'>
            <ConnectWallet.Panel />
            <Link href='/' className='text-lg underline'>
              Help, I don&apos;t have a wallet
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
