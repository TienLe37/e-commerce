import React, { useCallback, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Breadcrumb, Product, SearchItem } from '../../components';
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css';
import InputSelect from '../../components/InputSelect';
import { sortBy } from '../../utils/contants';
import Pagination from '../../components/Pagination';
const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [sort, setSort] = useState('');
  const fetchProductsbyCategory = async (queries) => {
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response);
  };

  const [params] = useSearchParams();
  useEffect(() => {
    // search color
    const queries = {};
    for (let i of params) queries[i[0]] = i[1];
    // search price from-to
    let priceQuery = {};
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) queries.price = { gte: queries.from };
      if (queries.to) queries.price = { lte: queries.to };
    }

    delete queries.from;
    delete queries.to;
    const lastQueries = { ...priceQuery, ...queries };
    fetchProductsbyCategory(lastQueries);
    window.scrollTo(0, 0);
  }, [params]);
  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );
  const changeValue = useCallback(
    (value) => {
      setSort(value);
    },
    [sort]
  );
  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [sort]);

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
        <div className='w-1/5 flex flex-col gap-3 '>
          <span className='font-semibold text-sm'>Sort By</span>
          <div className='w-full'>
            <InputSelect
              value={sort}
              changeValue={changeValue}
              options={sortBy}
            />
          </div>
        </div>
      </div>
      <div className='w-full mt-8'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid flex mx-[-10px]'
          columnClassName='my-masonry-grid_column'
        >
          {products?.products?.map((el) => (
            <Product key={el._id} productData={el} normal={true} />
          ))}
        </Masonry>
      </div>
      <div className='w-full m-auto my-4 flex justify-center'>
        <Pagination totalCount={products?.counts} />
      </div>
    </div>
  );
};

export default Products;
