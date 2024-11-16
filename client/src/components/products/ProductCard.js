import React, { memo } from 'react';
import { formatMoney, renderStar } from 'utils/helpers';
const ProductCard = ({ price, totalRatings, title, image }) => {
  return (
    <div className='w-1/3 flex flex-auto px-[10px] mb-[20px]'>
      <div className='w-full flex border cursor-pointer '>
        <img
          src={image}
          alt='products'
          className='w-[90px]  object-contain p-4'
        />
        <div className='flex flex-col mt-[15px] items-start gap-1 w-full text-sm'>
          <span className='flex h-4'>
            {renderStar(totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className='line-clamp-1 capitalize text-center '>
            {title.toLowerCase()}
          </span>
          <span>{`${formatMoney(+price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
