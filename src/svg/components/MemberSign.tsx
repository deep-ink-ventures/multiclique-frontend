import type { SvgProps } from './SvgWrapper';
import { withSvgProps } from './SvgWrapper';

type IMemberSign = SvgProps;

const MemberSign = withSvgProps<IMemberSign>(
  ({ className = 'stroke-black h-3 w-3' }) => {
    return (
      <svg
        className={className}
        viewBox='0 0 16 16'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M7.23279 9.86595H5.26631C4.04462 9.86595 3.43377 9.86595 2.95193 10.0655C2.30947 10.3316 1.79903 10.8421 1.53292 11.4845C1.33333 11.9664 1.33333 12.5772 1.33333 13.7989M10.1825 2.19059C11.1434 2.57955 11.8213 3.52161 11.8213 4.62198M7.88821 14.1267L9.21564 13.8612C9.33138 13.838 9.38925 13.8265 9.44322 13.8053C9.49111 13.7865 9.53663 13.7622 9.57883 13.7327C9.62638 13.6996 9.66811 13.6578 9.75157 13.5744L14.1155 9.21048C14.4776 8.84845 14.4776 8.26147 14.1155 7.89944C13.7535 7.53743 13.1665 7.53743 12.8045 7.89946L8.44056 12.2634C8.3571 12.3469 8.31538 12.3886 8.28222 12.4361C8.25279 12.4783 8.22843 12.5238 8.20964 12.5717C8.18848 12.6257 8.1769 12.6836 8.15375 12.7993L7.88821 14.1267ZM8.87153 4.62198C8.87153 6.07006 7.69763 7.24397 6.24955 7.24397C4.80147 7.24397 3.62757 6.07006 3.62757 4.62198C3.62757 3.1739 4.80147 2 6.24955 2C7.69763 2 8.87153 3.1739 8.87153 4.62198Z'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  }
);

export default MemberSign;
