import React, { memo } from 'react';

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className='bg-[#eaf0f7] '>
      <span
        onClick={() => handleChangeQuantity('-')}
        className='p-2 cursor-pointer  border-r border-black  '
      >
        -
      </span>
      <input
        className='py-2 outline-none w-[50px]  text-center bg-[#eaf0f7]  text-black '
        type='text'
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      />
      <span
        onClick={() => handleChangeQuantity('+')}
        className='p-2 cursor-pointer  border-l border-black '
      >
        +
      </span>
    </div>
  );
};

export default memo(SelectQuantity);
