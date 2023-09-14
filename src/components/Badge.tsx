export const statusColors = {
  Active: 'bg-neutral text-base-100',
  Pending: 'bg-warning text-warning-content',
  Approved: 'bg-success text-neutral-content',
  Cancelled: 'bg-error text-error-content',
  undefined: 'bg-neutral text-base-100',
};

interface IBadge {
  status?: keyof typeof statusColors;
}

export const TransactionBadge = ({ status }: IBadge) => {
  return (
    <div
      className={`rounded-full ${
        !status ? '' : statusColors[status]
      } h-7 rounded-3xl px-3 text-center text-[0.625rem] leading-7`}>
      {status}
    </div>
  );
};