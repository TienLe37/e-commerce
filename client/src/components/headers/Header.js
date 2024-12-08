import React, { Fragment, memo,useState,useEffect } from 'react';
import icons from 'utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'store/user/userSlice';

import logo from 'assets/logo.png';
import { Link } from 'react-router-dom';
import path from 'utils/path';
import { showCart } from 'store/app/appSlice';
import { FaCartShopping } from 'react-icons/fa6';
const { RiPhoneFill, MdEmail, FaUserCircle } = icons;
const Header = () => {
  const { current } = useSelector((state) => state.user);
  const [showOption, setShowOption] = useState(false)
  const dispatch = useDispatch()
  // useEffect(() => {
  //   const handleClickoutOption = (e) => {
  //       const profile = document.getElementById('profile')
  //       if(!profile?.contains(e.target)) setShowOption(false)
  //   }
  //   document.addEventListener('click', handleClickoutOption)
  //   return () => {
  //     document.removeEventListener('click', handleClickoutOption)
  //   }
  // }, [])
  
  return (
    <div className=' w-main flex justify-between h-[110px]  py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt='logo' className='w-[234px] object-contain' />
      </Link>
      <div className='flex text-[13px] '>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex gap-4 items-center'>
            <RiPhoneFill color='red' size={18} />
            <span className='font-semibold'>09686868686</span>
          </span>
          <span>Mon-Sat 8:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='red' size={18} />
            <span className='font-semibold'>tiendev37@gmail.com</span>
          </span>
          <span>Support 24/7</span>
        </div>

        {current && (
          <Fragment>
            <div 
            onClick={() => dispatch(showCart())}
            className='relative  flex items-center justify-center cursor-pointer gap-2 px-4 border-r animate-scale-up-hor-right '>
             <FaCartShopping color='red' size={25} />
             <small className='absolute top-[-2px] right-[6px]  w-[20px] h-[18px] py-[2px] flex justify-center items-center rounded-full text-sm bg-white border-main text-main  border'> 
             {`${current?.cart?.length || 0}`}</small>
            </div>
            <div
              onMouseEnter={e => {
                e.stopPropagation()
                setShowOption(true)
              }}
              onMouseLeave={e => {
                e.stopPropagation()
                setShowOption(false)
              }}
              id='profile'
              className='relative flex items-center justify-center cursor-pointer gap-2 px-4 border-r'
            >
              <FaUserCircle color='red' size={20} />
              {showOption && 
                <div
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  className='absolute z-50 top-full flex-col flex shadow-md rounded-md right-0 bg-[#fff] border min-w-[150px] '>
                  {+current?.role === 1945 && 
                    <Link  to={`/${path.ADMIN}/${path.DASHBOARD}` }
                    className='p-2 w-full hover:bg-sky-100'  
                   >
                    Admin Workspace
                    </Link>}
                  <Link  to={`/${path.MEMBER}/${path.PERSONAL}` }
                  className='p-2 w-full hover:bg-sky-100'  
                  >
                    My Account
                  </Link>
                  <Link  to={`/${path.DETAIL_CART}` }
                  className='p-2 w-full hover:bg-sky-100'  
                  >
                    My Shopping Cart
                  </Link>
                  <span 
                  className='p-2 w-full hover:bg-sky-100'  
                  onClick={() => dispatch(logout())}
                  >Logout</span>
                </div>}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
