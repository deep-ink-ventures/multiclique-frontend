import type { AppProps } from 'next/app';
import * as SorobanClient from 'soroban-client';
import StellarSdk from 'stellar-sdk';

import '../styles/global.css';

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
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
