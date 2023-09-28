import { isValidEd25519PublicKey } from '@/utils/index';
import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';

import d from '@/svg/delete.svg';
import plus from '@/svg/plus.svg';

const SignatoriesForm = (props: {
  formName: string;
  listStartCount?: number;
  disabled?: boolean;
  maxCount?: number;
  minCount?: number;
  onAddSigner?: () => void;
  onDeleteSigner?: () => void;
}) => {
  const {
    onAddSigner,
    onDeleteSigner,
    listStartCount = 1,
    disabled,
    maxCount,
    minCount,
  } = props;
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: props.formName,
  });

  const handleAddSigner = () => {
    if (onAddSigner) {
      onAddSigner();
    }
    append({
      name: '',
      walletAddress: '',
    });
  };

  return (
    <>
      {fields.map((item, index) => {
        return (
          <div className='flex w-full px-4' key={item.id} data-k={item.id}>
            <div className='flex w-full'>
              <div className='mr-3 flex w-1/4 shrink-0 flex-col'>
                <p className='pl-8'>Name</p>
                <div className='flex '>
                  <div className='mr-4 flex flex-col justify-center'>
                    {index + listStartCount}
                  </div>
                  <input
                    type='text'
                    placeholder='Name'
                    className='input input-primary '
                    disabled={disabled}
                    {...register(`${props.formName}.${index}.name`, {
                      required: 'Required',
                      minLength: { value: 1, message: 'Minimum is 1' },
                      maxLength: { value: 30, message: 'Maximum is 30' },
                    })}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name={`${props.formName}.${index}.name`}
                  render={({ message }) => (
                    <p className='mt-1 pl-8 text-error-content'>{message}</p>
                  )}
                />
              </div>
              <div className='flex flex-auto flex-col'>
                <p className='ml-1'>Wallet Address</p>
                <input
                  type='text'
                  placeholder='Wallet Address'
                  className='input input-primary'
                  disabled={disabled}
                  {...register(`${props.formName}.${index}.address`, {
                    required: 'Required',
                    validate: (add) =>
                      isValidEd25519PublicKey(add) || 'Not a valid address',
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
              {!disabled &&
                (!minCount || index > minCount - listStartCount) && (
                  <div className='ml-3 flex items-center pt-5'>
                    <Image
                      className='duration-150 hover:cursor-pointer hover:brightness-125 active:brightness-90'
                      src={d}
                      width={18}
                      height={18}
                      alt='delete button'
                      onClick={() => {
                        if (onDeleteSigner) {
                          onDeleteSigner();
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
      {(!maxCount || fields.length < maxCount) && (
        <div className='mb-4'>
          <button
            className='btn btn-primary'
            type='button'
            disabled={disabled}
            onClick={handleAddSigner}>
            <Image
              src={plus}
              width={17}
              height={17}
              alt='add one'
              className='mr-2'
            />
            Add a Signer
          </button>
        </div>
      )}
    </>
  );
};

export default SignatoriesForm;
