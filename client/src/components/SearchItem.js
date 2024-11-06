import React, { memo } from 'react';
import { AiOutlineDown } from 'react-icons/ai';

const SearchItem = ({ name, activeClick, changeActiveFilter }) => {
  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className='p-3 gap-2 text-gray-500 text-xs relative border cursor-pointer border-gray-500 flex justify-between items-center '
    >
      <span>{name}</span>
      <AiOutlineDown />
      {activeClick === name && (
        <div className='absolute top-full left-0 right-0 w-fit p-4 bg-gray-700 '>
          content
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
