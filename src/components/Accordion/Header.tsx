import Chevron from '@/svg/components/Chevron';
import cn from 'classnames';
import type { ReactNode } from 'react';
import { useAccordionContext } from './context';

const BgColorMap: Record<string, string> = {
  success: 'bg-success-light',
  warning: 'bg-warning-light',
  danger: 'bg-error-light',
  base: 'bg-base-200',
};

export interface IAccordionHeader {
  children?: ReactNode;
  className?: string;
}

export const AccordionHeader = ({ className, children }: IAccordionHeader) => {
  const { id, onClick, expanded, color } = useAccordionContext();

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const bgColor = color && BgColorMap[color];

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center border-b border-base-300 p-4',
        bgColor,
        className
      )}
      onClick={handleClick}>
      {children}
      <div className='ml-auto'>
        <Chevron
          className={cn(
            'pointer-events-none ml-3 h-3 w-3 fill-black  transition-all ease-in-out',
            {
              '-rotate-90': !expanded,
              'rotate-90': expanded,
            }
          )}
        />
      </div>
    </div>
  );
};
