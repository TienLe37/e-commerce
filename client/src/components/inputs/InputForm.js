import clsx from 'clsx';
import React, { memo } from 'react';

const InputForm = ({
  label,
  disable,
  register,
  errors,
  id,
  validate,
  type = 'text',
  placeholder,
  fullWidth,
  defaultValue,
  style,
}) => {
  return (
    <div className={clsx('flex flex-col h-[70px] gap-2', style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disable}
        placeholder={placeholder}
        className={clsx('form-input my-auto', fullWidth && 'w-full')}
        defaultValue={defaultValue}
      />
      {errors[id] && (
        <small className='text-xs text-red-500 '>{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(InputForm);
