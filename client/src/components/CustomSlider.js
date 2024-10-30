import React, { memo } from 'react';
import Slider from 'react-slick';
import { Product } from './';
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const CustomSlider = ({ products, activedTab }) => {
  return (
    <>
      {products && (
        <Slider {...settings} className='w-full'>
          {products?.map((el, index) => (
            <Product
              key={index}
              productData={el}
              isNew={activedTab === 2 ? true : false}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(CustomSlider);
