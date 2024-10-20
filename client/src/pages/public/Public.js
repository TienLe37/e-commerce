import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Navigation } from '../../components';
const Public = () => {
  return (
    <divs className='w-full flex flex-col items-center'>
      <Header />
      <Navigation />
      <div>
        <Outlet />
      </div>
    </divs>
  );
};

export default Public;
