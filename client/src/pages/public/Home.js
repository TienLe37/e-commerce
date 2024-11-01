import React from 'react';

import icons from '../../utils/icons';

import {
  Sidebar,
  Banner,
  BestSeller,
  DealDailyy,
  FeatureProduct,
  CustomSlider,
} from '../../components';
import { useSelector } from 'react-redux';
const { IoIosArrowForward } = icons;
const Home = () => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  return (
    <>
      <div className='w-main flex '>
        <div className='flex flex-col gap-5 w-[25%] flex-auto '>
          <Sidebar />
          <DealDailyy />
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto '>
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className='w-main my-8'>
        <FeatureProduct />
      </div>
      <div className='w-main my-8'>
        <h3 className='text-[20px]  font-semibold py-[20px] border-b-2 border-main uppercase  '>
          New Arrivals
        </h3>
        <div className='mt-4 mx-[-10px]'>
          <CustomSlider products={newProducts} activedTab={2} />
        </div>
      </div>

      <div className='w-main my-8'>
        <h3 className='text-[20px]  font-semibold py-[20px] border-b-2 border-main uppercase  '>
          Hot collections
        </h3>
        <div className=' flex flex-wrap gap-4 mt-4  '>
          {categories
            ?.filter((el) => el.brand.length > 0)
            .map((el) => (
              <div key={el.id} className='w-[389px]'>
                <div className='border flex p-4 gap-4 min-h-[202px]'>
                  <img
                    src={el?.image}
                    alt=''
                    className='w-[144px] flex-1 h-[129px] object-cover '
                  />
                  <div className='flex-1 text-gray-700  '>
                    <h4 className='font-semibold uppercase'>{el.title}</h4>
                    <ul className='text-sm'>
                      {el?.brand?.map((item) => (
                        <span className='flex gap-1 items-center text-gray-700'>
                          <IoIosArrowForward size={14} />
                          <li key={item}>{item}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className='w-main my-8'>
        <h3 className='text-[20px]  font-semibold py-[20px] border-b-2 border-main uppercase  '>
          blog posts
        </h3>
      </div>
    </>
  );
};

export default Home;
