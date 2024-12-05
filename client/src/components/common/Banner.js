import React, { memo } from 'react';
import mobile  from 'assets/mobile1.jpg';

const Banner = () => {
  return (
    <div>
      <img
        // src='https://digital-world-4.myshopify.com/cdn/shop/files/slideshow2-home4_1920x.jpg?v=1613501343'
        src={mobile}
        alt='banner'
        className='h-[400px] w-full object-cover'
      />
    </div>
  );
};

export default memo(Banner);
