import { NETWORK, NETWORK_PASSPHRASE } from '@/config';
import useMCStore, { TxnResponse } from '@/stores/MCStore';
import { getNetworkDetails } from '@stellar/freighter-api';
import { useEffect, useState } from 'react';

const IDLE_INTERVAL = 10000;
const ACTIVE_INTERVAL = 3000;
const INACTIVITY_INTERVAL = 5000;

const useNetworkStatus = () => {
  const [currentAccount, addTxnNotification, updateCurrentAccount] = useMCStore(
    (s) => [s.currentAccount, s.addTxnNotification, s.updateCurrentAccount]
  );
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<{
    networkPassphrase?: string;
  }>();

  let timeoutId: any;
  let lastActivityTimestamp = Date.now();

  const checkNetworkStatus = async () => {
    if (!currentAccount) {
      try {
        const networkDetails = await getNetworkDetails();
        setCurrentNetwork(networkDetails);
        setIsSupportedNetwork(
          networkDetails.networkPassphrase === NETWORK_PASSPHRASE[NETWORK]
        );
      } catch (error) {
        console.error('Error checking network:', error);
      }
    } else {
      try {
        const networkDetails = await getNetworkDetails();
        setCurrentNetwork(networkDetails);
        setIsSupportedNetwork(
          currentAccount.networkPassphrase === NETWORK_PASSPHRASE[NETWORK]
        );
      } catch (error) {
        console.error('Error checking network:', error);
      }
    }
  };

  const startPollingWithInterval = (interval: number) => {
    timeoutId = setTimeout(() => {
      checkNetworkStatus();
      startPollingWithInterval(interval);
    }, interval);
  };

  const startActivePolling = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTimestamp;
    if (timeSinceLastActivity > ACTIVE_INTERVAL) {
      clearTimeout(timeoutId);
      lastActivityTimestamp = Date.now();
      startPollingWithInterval(ACTIVE_INTERVAL);
    }
  };

  const startIdlePolling = () => {
    checkNetworkStatus();
    startPollingWithInterval(IDLE_INTERVAL);
  };

  const checkInactivity = () => {
    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTimestamp;
    if (timeSinceLastActivity > IDLE_INTERVAL) {
      clearTimeout(timeoutId);
      lastActivityTimestamp = Date.now();
      startPollingWithInterval(IDLE_INTERVAL);
    }
  };

  useEffect(() => {
    startIdlePolling();

    const inactivityTimeout = setInterval(checkInactivity, INACTIVITY_INTERVAL);

    document.addEventListener('mousemove', startActivePolling);
    document.addEventListener('keydown', startActivePolling);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(inactivityTimeout);
      document.removeEventListener('mousemove', startActivePolling);
      document.removeEventListener('keydown', startActivePolling);
    };
  }, []);

  useEffect(() => {
    if (
      !isSupportedNetwork &&
      currentAccount &&
      currentNetwork?.networkPassphrase !== NETWORK_PASSPHRASE[NETWORK]
    ) {
      addTxnNotification({
        title: 'Unsupported Network',
        message: 'Please connect to FUTURENET',
        type: TxnResponse.Error,
        timestamp: Date.now(),
      });
      updateCurrentAccount(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupportedNetwork, currentAccount]);

  return isSupportedNetwork;
};

export default useNetworkStatus;
