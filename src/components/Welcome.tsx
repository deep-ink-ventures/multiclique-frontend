import plus from '@/svg/plus.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

import SelectAccount from './SelectAccount';

const Welcome = () => {
  const router = useRouter();
  const handleCreateNewAccount = () => {
    router.push('/account/create');
  };

  return (
    <div className='flex flex-col items-center justify-center p-3'>
      <div className='my-3'>
        <h1 className='text-xl'>Welcome to MultiClique</h1>
      </div>

      <div className='my-5 flex w-full flex-col items-center justify-around space-y-7'>
        <div className='flex flex-col items-center justify-center'>
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
        <SelectAccount />
      </div>
    </div>
  );
};

export default Welcome;
