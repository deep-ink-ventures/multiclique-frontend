import useMCStore, { TxnResponse } from '@/stores/MCStore';
import { truncateMiddle } from '@/utils';
import { useRef } from 'react';

const useCopyToClipboard = <T extends HTMLElement>() => {
  const textRef = useRef<T>(null);
  const { addTxnNotification } = useMCStore();

  const copyToClipboard = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.innerText;
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addTxnNotification({
        title: 'Copied to Clipboard',
        message: truncateMiddle(textToCopy, 5, 3),
        type: TxnResponse.Success,
        timestamp: new Date().valueOf(),
      });
    }
  };

  return { textRef, copyToClipboard };
};

export default useCopyToClipboard;
