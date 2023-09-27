import useMCStore from '@/stores/MCStore';
import { useEffect, useMemo, useState } from 'react';

import { usePromise } from '@/hooks/usePromise';
import { AccountService, ListMultiCliqueAccountsParams } from '@/services';
import AccountCards from './AccountCards';

const SelectAccount = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isTxnProcessing, multisigAccounts] = useMCStore((s) => [
    s.isTxnProcessing,
    s.multisigAccounts,
  ]);

  const listMultiCliqueAccounts = usePromise({
    promiseFunction: async (params: ListMultiCliqueAccountsParams) => {
      const response = await AccountService.listMultiCliqueAccounts(params);
      return response;
    },
  });

  useEffect(() => {
    listMultiCliqueAccounts.call({
      offset: 0,
      limit: 10,
    });
  }, []);

  // fetch multisig accounts

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
          disabled={isTxnProcessing}
        />
        <AccountCards accounts={filteredDaos} />
      </div>
    </div>
  );
};

export default SelectAccount;
