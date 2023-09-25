import useMCStore from '@/stores/MCStore';
import { useMemo, useState } from 'react';

import AccountCards from './AccountCards';

const SelectAccount = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isTxnProcessing, multisigAccounts] = useMCStore((s) => [
    s.isTxnProcessing,
    s.multisigAccounts,
  ]);

  // fetch multisig accounts

  const filteredDaos = useMemo(() => {
    return multisigAccounts?.filter((account) => {
      return (
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

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
