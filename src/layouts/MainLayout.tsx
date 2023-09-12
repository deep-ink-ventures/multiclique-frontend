import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import WalletConnect from '@/components/WalletConnect';

import { Meta } from '@/components';
import logo from '@/svg/logo.svg';

interface IMainProps {
  title: string;
  description: string;
  canonical?: string;
  siteName?: string;
  children: ReactNode;
}

/**
 *
 * @param meta
 * @param children
 * @returns
 */
export const MainLayout = (props: IMainProps) => (
  <>
    <div className='flex flex-wrap justify-between bg-base-200 py-4 drop-shadow-sm'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center px-6 align-middle '>
        <div className='flex items-center justify-center align-middle '>
          <Link href='/'>
            <div className='mask mask-diamond bg-primary p-4'>
              <Image
                src={logo}
                width={24}
                height={24}
                alt='MultiClique logo'
                className=''
              />
            </div>
          </Link>
          <h2 className='m-auto pl-2 text-[20px] md:text-[24px]'>
            <Link href='/'>MultiClique</Link>
          </h2>
        </div>
        <div className='ml-auto py-2'>
          <WalletConnect text='Connect Wallet' />
        </div>
      </div>
    </div>
    <div className='m-auto max-w-screen-xl px-1'>
      <Meta
        title={props.title}
        description={props.description}
        canonical={props.canonical ? props.canonical : ''}
        siteName={props.siteName ? props.siteName : 'MultiClique'}
      />
      <div className='mx-auto'>
        <div className='m-2 min-h-screen rounded-2xl border-slate-800 p-2'>
          {props.children}
        </div>
      </div>
    </div>
  </>
);
