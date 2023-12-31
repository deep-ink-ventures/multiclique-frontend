import type { SvgProps } from './SvgWrapper';
import { withSvgProps } from './SvgWrapper';

type ICoins = SvgProps;

const Coins = withSvgProps<ICoins>(({ className = 'stroke-black' }) => {
  return (
    <svg
      className={className}
      viewBox='0 0 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M13.2813 13.7814C16.1334 13.3996 18.3332 10.9567 18.3332 7.99999C18.3332 4.77833 15.7215 2.16666 12.4998 2.16666C9.54315 2.16666 7.10025 4.36638 6.71839 7.21855M13.3332 13C13.3332 16.2217 10.7215 18.8333 7.49984 18.8333C4.27818 18.8333 1.6665 16.2217 1.6665 13C1.6665 9.77833 4.27818 7.16666 7.49984 7.16666C10.7215 7.16666 13.3332 9.77833 13.3332 13Z'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
});

export default Coins;
