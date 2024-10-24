import React from 'react';

import { Sidebar, Banner, BestSeller } from '../../components';
const Home = () => {
  return (
    <div className='w-main flex'>
      <div className='flex flex-col gap-5 w-[20%] flex-auto '>
        <Sidebar />
        <span>Daily</span>
      </div>
      <div className='flex flex-col gap-5 w-[80%] flex-auto border'>
        <Banner />
        <BestSeller />
      </div>
    </div>
  );
};

export default Home;
