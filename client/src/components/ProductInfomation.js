import React, { memo, useState } from 'react';
import { productInfoTabs } from '../utils/contants';

const ProductInfomation = () => {
  const [activeTab, setActiveTab] = useState(1);
  console.log(activeTab);
  return (
    <div>
      <div className='flex items-center gap-2 relative bottom-[-1px]'>
        {productInfoTabs.map((el) => (
          <span
            className={`py-2 px-4 cursor-pointer ${
              activeTab === +el.id
                ? 'bg-white border border-b-0'
                : 'bg-gray-200'
            }`}
            key={el.id}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className='w-full border p-4 h-[300px]'>
        {productInfoTabs.map((el) => (
          <p>{el.id === activeTab && el.content}</p>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductInfomation);
