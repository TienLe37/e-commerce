import React, { memo } from 'react';

const ProductExtraItem = ({ icon, title, sub }) => {
  return (
    <div className='flex items-center p-4 gap-4 mb-[10px] border cursor-pointer  hover:bg-main'>
      <span className='p-2 bg-gray-800 rounded-full items-center justify-center text-white '>
        {icon}
      </span>
      <div className='flex flex-col text-sm text-gray-500 hover:text-white'>
        <span className='font-medium '>{title}</span>
        <span className='text-xs'>{sub}</span>
      </div>
    </div>
  );
};

export default memo(ProductExtraItem);
