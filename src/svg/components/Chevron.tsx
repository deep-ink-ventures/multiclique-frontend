import cn from 'classnames';
import type { SvgProps } from './SvgWrapper';
import { withSvgProps } from './SvgWrapper';

interface IChevron extends SvgProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

const Chevron = withSvgProps<IChevron>(
  ({ className = 'fill-black h-3 w-3', direction = 'right' }) => {
    return (
      <svg
        className={cn(className, {
          'scale[-1]': direction === 'left',
          'rotate-90': direction === 'down',
        })}
        viewBox='0 0 9 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M8.80031 7.51648C8.80031 7.62637 8.77883 7.74176 8.73589 7.86264C8.69295 7.98352 8.6178 8.0989 8.51044 8.20879L2.16551 14.7033C1.97226 14.9011 1.73607 15 1.45694 15C1.1778 15 0.941613 14.9011 0.748366 14.7033C0.55512 14.5055 0.458496 14.2747 0.458496 14.011C0.458496 13.7473 0.55512 13.5165 0.748366 13.3187L6.41693 7.51648L0.748366 1.71429C0.555119 1.51648 0.458495 1.28022 0.458495 1.0055C0.458495 0.73077 0.555119 0.494507 0.748366 0.296704C0.941612 0.0989021 1.17243 3.26421e-07 1.44083 3.14689e-07C1.70923 3.02957e-07 1.94005 0.0989021 2.1333 0.296704L8.51044 6.82418C8.6178 6.93407 8.69295 7.04396 8.73589 7.15385C8.77883 7.26374 8.80031 7.38462 8.80031 7.51648Z' />
      </svg>
    );
  }
);

export default Chevron;
