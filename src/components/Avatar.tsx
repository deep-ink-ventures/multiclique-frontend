import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

interface IAvatar {
  src?: string | StaticImport;
  width?: number;
  height?: number;
}

export const Avatar = ({ src = '', width = 120, height = 120 }: IAvatar) => {
  return (
    <div className='relative flex w-fit items-center justify-center overflow-hidden rounded-full border'>
      <Image src={src} alt='avatar' width={width} height={height} />
    </div>
  );
};
