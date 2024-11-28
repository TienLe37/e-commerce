import React, { Fragment, memo,useState,useEffect } from 'react';
import icons from 'utils/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'store/user/userSlice';

import logo from 'assets/logo.png';
import { Link } from 'react-router-dom';
import path from 'utils/path';
import { showCart } from 'store/app/appSlice';
const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons;
const Header = () => {
  const { current } = useSelector((state) => state.user);
  const [showOption, setShowOption] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    const handleClickoutOption = (e) => {
        const profile = document.getElementById('profile')
        if(!profile?.contains(e.target)) setShowOption(false)
    }
    document.addEventListener('click', handleClickoutOption)
    return () => {
      document.removeEventListener('click', handleClickoutOption)
    }
  }, [])
  
  return (
    <div className=' w-main flex justify-between h-[110px]  py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt='logo' className='w-[234px] object-contain' />
      </Link>
      <div className='flex text-[13px] '>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex gap-4 items-center'>
            <RiPhoneFill color='red' />
            <span className='font-semibold'>09686868686</span>
          </span>
          <span>Mon-Sat 8:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='red' />
            <span className='font-semibold'>tiendev37@gmail.com</span>
          </span>
          <span>Support 24/7</span>
        </div>

        {current && (
          <Fragment>
            <div 
            onClick={() => dispatch(showCart())}
            className='flex items-center justify-center cursor-pointer gap-2 px-4 border-r'>
              <BsHandbagFill color='red' size={16} />
              <span className='text-[16px]'>{`${current?.cart?.length || 0} items`}</span>
            </div>
            <div
              onClick={e => {
                e.stopPropagation()
                setShowOption(prev => !prev)
              }}
              id='profile'
              className='relative flex items-center justify-center cursor-pointer gap-2 px-4 border-r'
            >
              <FaUserCircle color='red' size={16} />
              <span className='text-[16px]'>Profile</span>
              {showOption && 
                <div
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  className='absolute top-full flex-col flex left-[16px] bg-gray-100 border min-w-[150px] py-2 '>
                  {+current?.role === 1945 && 
                    <Link  to={`/${path.ADMIN}/${path.DASHBOARD}` }
                    className='p-2 w-full hover:bg-sky-100'  
                   >
                    Admin Worspace
                    </Link>}
                  <Link  to={`/${path.MEMBER}/${path.PERSONAL}` }
                  className='p-2 w-full hover:bg-sky-100'  
                  >
                    Personal
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
