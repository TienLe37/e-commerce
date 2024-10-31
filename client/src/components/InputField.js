import React from 'react';

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
}) => {
  return (
    <div className='w-full'>
      <label htmlFor={nameKey}>
        {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
      </label>
      <input
        type={type || 'text'}
        className='px-4 py-2 rounded-md border w-full placeholder:text-sm outline-none placeholder:italic my-1 '
        placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={(e) =>
          setValue((pre) => ({ ...pre, [nameKey]: e.target.value }))
        }
      />
    </div>
  );
};

export default InputField;
