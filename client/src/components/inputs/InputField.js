import clsx from 'clsx';
import React, { memo } from 'react';

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  style,
  fullWidth,
  placeholder,
  isHideLabel,
}) => {
  return (
    <div
      className={clsx('flex flex-col relative mb-2 ', fullWidth && 'w-full')}
    >
      {!isHideLabel && (
        <label htmlFor={nameKey}>
          {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
        </label>
      )}
      <input
        type={type || 'text'}
        className={clsx(
          'px-4 py-2 rounded-md border w-full placeholder:text-sm focus:ring-0 placeholder:italic my-1 ',
          style
        )}
        placeholder={
          placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)
        }
        value={value}
        onChange={(e) =>
          setValue((pre) => ({ ...pre, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some((el) => el.name === nameKey) && (
        <small className='text-main italic'>
          {invalidFields?.find((el) => el.name === nameKey)?.mes}
        </small>
      )}
    </div>
  );
};

export default memo(InputField);
