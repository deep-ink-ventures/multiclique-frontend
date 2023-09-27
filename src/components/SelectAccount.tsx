import { useEffect, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { usePromise } from '@/hooks/usePromise';
import type { ListMultiCliqueAccountsParams } from '@/services';
import { AccountService } from '@/services';
import useMCStore from '@/stores/MCStore';
import AccountCards from './AccountCards';

const SelectAccount = () => {
  const [currentAccount] = useMCStore((s) => [s.currentAccount]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  const listMultiCliqueAccounts = usePromise({
    promiseFunction: async (params: ListMultiCliqueAccountsParams) => {
      const response = await AccountService.listMultiCliqueAccounts(params);
      return response;
    },
  });

  useEffect(() => {
    if (currentAccount?.publicKey) {
      listMultiCliqueAccounts.call({
        offset: 0,
        limit: 10,
        search: debouncedSearchTerm,
        signatories: currentAccount?.publicKey,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, currentAccount]);

  const filteredDaos = useMemo(() => {
    return listMultiCliqueAccounts.value?.results?.filter((account) => {
      return (
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, listMultiCliqueAccounts.value?.results]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='flex flex-col items-center justify-center '>
      <div className='mb-5 text-lg'>
        {`You are a signer of these Multisig Accounts:`}{' '}
      </div>
      <div className='flex w-[480px] flex-col items-center justify-center'>
        <input
          id='search-input'
          className='input input-primary mb-5 w-full text-sm'
          placeholder='Search for account name or address'
          onChange={handleSearch}
          disabled={listMultiCliqueAccounts.pending}
        />
        <AccountCards accounts={filteredDaos} />
      </div>
    </div>
  );
};

export default SelectAccount;
