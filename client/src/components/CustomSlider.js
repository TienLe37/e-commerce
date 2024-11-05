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
const CustomSlider = ({ products, activedTab, normal }) => {
  return (
    <>
      {products && (
        <Slider {...settings} className='custom-slider'>
          {products?.map((el, index) => (
            <Product
              key={index}
              productData={el}
              isNew={activedTab === 2 ? true : false}
              normal={normal}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(CustomSlider);
