import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct } from '../../apis/product';
const DetailProduct = () => {
  const { pid, title } = useParams();
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    console.log(response);
  };
  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  return (
    <div className='w-main'>
      <h3>{title}</h3>
    </div>
  );
};

export default DetailProduct;
