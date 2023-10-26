import useMCStore from '@/stores/MCStore';

const Dashboard = () => {
  const [account] = useMCStore((s) => [s.pages.account]);
  return (
    <div className='flex flex-col space-y-3'>
      <div className='text-lg font-semibold'>{account.multisig.data?.name}</div>
      <div>
        <div className='text-lg font-semibold'>Signatories:</div>
        <div className='flex flex-col'>
          {account.multisig.data?.signatories?.map((signatory, index) => {
            return (
              <div key={signatory.address + index}>{signatory.address}</div>
            );
          })}
        </div>
      </div>
      <div className='text-lg font-semibold'>Threshold:</div>
      <div>{account.multisig.data?.defaultThreshold}</div>
      <div>
        <div className='text-lg font-semibold'>Policy:</div>
        <div>
          {account.multisig.data?.policy.name} is{' '}
          {account.multisig.data?.policy.contracts?.length
            ? 'Active'
            : 'Inactive'}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
