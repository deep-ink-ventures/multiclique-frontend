/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import type { AppProps } from 'next/app';
import * as SorobanClient from 'soroban-client';
import StellarSdk from 'stellar-sdk';

import TransactionNotification from '@/components/Notification';
import { LoadingScreenController } from '@/context/LoadingScreen';

import useNetworkStatus from '@/hooks/useNetworkStatus';
import useMCStore from '@/stores/MCStore';
import '@/styles/global.css';
import { useCallback, useEffect, useMemo } from 'react';

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
  const fetchConfig = useMCStore((s) => s.fetchConfig);

  const fetchConfigCb = useCallback(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    fetchConfigCb();
  }, [fetchConfigCb]);

  useNetworkStatus();

  const MemoizedTransactionNotification = useMemo(
    () => <TransactionNotification />,
    []
  );
  const MemoizedComponent = useMemo(
    () => (
      <LoadingScreenController>
        <Component {...pageProps} />
      </LoadingScreenController>
    ),
    []
  );

  return (
    <div className='relative overflow-x-hidden'>
      {MemoizedTransactionNotification}
      {MemoizedComponent}
    </div>
  );
};

export default MyApp;
