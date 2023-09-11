import type { AppProps } from 'next/app';
import * as SorobanClient from 'soroban-client';
import StellarSdk from 'stellar-sdk';

import { MainLayout } from '@/layouts';
import '@/styles/global.css';

declare global {
  interface Window {
    StellarSdk: any;
    SorobanClient: any;
  }
}
if (typeof window !== 'undefined') {
  window.StellarSdk = StellarSdk;
  window.SorobanClient = SorobanClient;
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='relative overflow-x-hidden'>
      <MainLayout title='MultiClique' description=''>
        <Component {...pageProps} />
      </MainLayout>
    </div>
  );
};

export default MyApp;
