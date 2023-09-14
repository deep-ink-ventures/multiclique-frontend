import plus from '@/svg/plus.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Welcome = () => {
  const router = useRouter();
  const handleCreateNewAccount = () => {
    router.push('/account/create');
  };

  return (
    <div className='flex flex-col items-center justify-center p-3'>
      <div className='my-3'>
        <h1>Welcome to MultiClique</h1>
      </div>

      <div className='my-5 flex w-full justify-around'>
        <div className='flex w-[330px] flex-col items-center justify-center rounded-lg bg-neutral p-6 shadow-xl'>
          <div className='mb-5'>Create a new Multisig Account</div>
          <button className='btn btn-primary' onClick={handleCreateNewAccount}>
            <Image
              src={plus}
              width={17}
              height={17}
              alt='add one'
              className='mr-2'
            />
            Create New Account
          </button>
        </div>
        {/* this will be a dropdown menu ?? */}
        <div className=' flex w-[330px] flex-col items-center justify-center rounded-lg bg-neutral p-5 shadow-xl'>
          <div className='mb-5'>Use an Existing Account</div>
          <button className={'btn btn-primary'}>Use Existing Account</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
