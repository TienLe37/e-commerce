import React, { useEffect, useState } from 'react';
import { apiGetProduct } from '../apis/product';
import { CustomSlider } from './';
import { getNewProducts } from '../store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
const tabs = [
  { id: 1, name: 'best sellers' },
  { id: 2, name: 'new arrivals' },
];

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [activedTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);
  const fetchProduct = async () => {
    const response = await apiGetProduct({ sort: '-sold' });
    if (response.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
  };
  useEffect(() => {
    fetchProduct();
    dispatch(getNewProducts());
  }, []);
  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);
  return (
    <div>
      <div className='flex text-[20px] ml-[-32px] '>
        {tabs.map((el, index) => (
          <span
            key={index}
            className={`font-semibold uppercase  px-8 border-r cursor-pointer text-gray-400 
              ${activedTab === el.id ? ' text-main ' : ''} `}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className='mt-4 border-t-2 border-main pt-4'>
        <CustomSlider products={products} activedTab={activedTab} />
      </div>
      <div className='w-full flex gap-4 mt-8 '>
        <img
          src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657'
          alt='banner'
          className=' flex-1 object-contain '
        />
        <img
          src='https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657'
          alt='banner'
          className=' flex-1 object-contain '
        />
      </div>
    </div>
  );
};

export default BestSeller;
