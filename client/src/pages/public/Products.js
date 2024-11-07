import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Product, SearchItem } from '../../components';
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css';
const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const fetchProductsbyCategory = async (queries) => {
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response.products);
  };

  const [params] = useSearchParams();
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];
    fetchProductsbyCategory(queries);
  }, [params]);
  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );
  return (
    <div className='w-main'>
      <div className='w-full bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
        <h3 className='pb-2 font-semibold capitalize'>{category}</h3>
        <Breadcrumb category={category} />
      </div>
      <div className='w-full border p-4 flex justify-between mt-8 m-auto'>
        <div className='w-4/5 flex flex-col flex-auto gap-3'>
          <span className='font-semibold text-sm '>FilterBy</span>
          <div className='flex items-center gap-4'>
            <SearchItem
              name='Price'
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type='input'
            />
            <SearchItem
              name='Color'
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type='checkbox'
            />
          </div>
        </div>
        <div className='w-1/5 font-semibold text-sm flex-auto'>Sortby</div>
      </div>
      <div className='w-full mt-8'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid flex mx-[-10px]'
          columnClassName='my-masonry-grid_column'
        >
          {products?.map((el) => (
            <Product key={el._id} productData={el} normal={true} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default Products;
