import React from 'react';

function Product({ productData }) {
  return (
    <div className='w-1/3'>
      <img
        src={productData?.images[0] || productData?.images[1]}
        alt=''
        className=''
      />
    </div>
  );
}

export default Product;
