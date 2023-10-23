import useNetworkStatus from '@/hooks/useNetworkStatus';

// Separated component to not cause re-render to whole app
const NetworkPolling = () => {
  useNetworkStatus();
  return <></>;
};

export default NetworkPolling;
