import Avatar from '@/svg/avatar.svg';
import Copy from '@/svg/copy.svg';
import Image from 'next/image';

const Account = () => {
  return (
    <div className='flex w-full '>
      <div className='w-1/4 bg-white py-6 drop-shadow-md'>
        <div className='flex w-full flex-col items-center justify-center gap-4 p-4'>
          <div className='relative flex w-fit items-center justify-center overflow-hidden rounded-full border'>
            <Image src={Avatar} alt='mountain' width={120} height={120} />
          </div>
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
              <div>Owned Tokens</div>
              <div>10</div>
            </div>

            <Image
              src={Copy}
              height={15}
              width={15}
              alt='copy'
              className='ml-auto cursor-pointer'
            />
          </div>
        </div>
      </div>
      <div className='grow'></div>
    </div>
  );
};

export default Account;
