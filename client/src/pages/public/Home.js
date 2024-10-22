import React from 'react';
import { Sidebar, Banner } from '../../components';
const Home = () => {
  return (
    <div className='w-main flex'>
      <div className='flex flex-col gap-5 w-[20%] flex-auto '>
        <Sidebar />
        <span>Daily</span>
      </div>
      <div className='flex flex-col gap-5 w-[80%] flex-auto border'>
        <Banner />
        <span>Best Seller</span>
      </div>
    </div>
  );
};

export default Home;
