import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct } from '../../apis/product';
import { Breadcrumb } from '../../components';
const DetailProduct = () => {
  const { pid, title } = useParams();
  const [product, setProduct] = useState(null);
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) setProduct(response.productData);
  };
  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  return (
    <div className='w-main'>
      <h3>{title}</h3>
      <Breadcrumb title={title} category={product?.category} />
    </div>
  );
};

export default DetailProduct;
