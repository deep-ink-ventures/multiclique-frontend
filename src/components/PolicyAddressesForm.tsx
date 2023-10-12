import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Plus from '@/svg/components/Plus';
import deleteIcon from '@/svg/delete.svg';

export const PolicyAddressesForm = (props: {
  formName: string;
  disabled?: boolean;
  onAddAddress?: () => void;
  onRemoveAddress?: () => void;
}) => {
  const { onAddAddress, onRemoveAddress, disabled } = props;
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: props.formName,
  });

  const handleAddMember = () => {
    if (onAddAddress) {
      onAddAddress();
    }
    append({
      address: '',
    });
  };

  return (
    <>
      {fields.map((item, index) => {
        return (
          <div className='flex w-full px-4' key={item.id} data-k={item.id}>
            <div className='flex w-full'>
              <div className='flex flex-auto flex-col'>
                <p className='ml-1'>Contract Address</p>
                <input
                  type='text'
                  placeholder='Contract Address'
                  className='input input-primary'
                  disabled={disabled}
                  {...register(`${props.formName}.${index}.address`, {
                    required: 'Required',
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name={`${props.formName}.${index}.address`}
                  render={({ message }) => (
                    <p className='ml-2 mt-1 text-error-content'>{message}</p>
                  )}
                />
              </div>
              {!disabled && (
                <div className='ml-3 flex items-center pt-5'>
                  <Image
                    className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
                    src={deleteIcon}
                    width={18}
                    height={18}
                    alt='delete button'
                    onClick={() => {
                      if (onRemoveAddress) {
                        onRemoveAddress();
                      }
                      remove(index);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className='mb-4'>
        <button
          className='btn btn-outline'
          type='button'
          disabled={disabled}
          onClick={handleAddMember}>
          <Plus className='mr-2 h-3 w-3' />
          Add an Address
        </button>
      </div>
    </>
  );
};
