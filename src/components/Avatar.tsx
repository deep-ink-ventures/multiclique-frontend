import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

interface IAvatar {
  src?: string | StaticImport;
}

export const Avatar = ({ src = '' }: IAvatar) => {
  return (
    <div className='relative flex w-fit items-center justify-center overflow-hidden rounded-full border'>
      <Image src={src} alt='avatar' width={120} height={120} />
    </div>
  );
};
