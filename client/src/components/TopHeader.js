import React, { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import path from '../utils/path';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from '../store/user/asyncActions';
import { AiOutlineLogout } from 'react-icons/ai';
import { logout } from '../store/user/userSlice';

const TopHeader = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLoggedIn) dispatch(getCurrent());
  }, [dispatch, isLoggedIn]);

  return (
    <div className='h-[40px] w-full bg-main flex  items-center justify-center '>
      <div className='w-main flex items-center justify-between text-xs text-white '>
        <span>ORDER ONLINE OR CALL US 09686868686</span>

        {isLoggedIn ? (
          <div className='flex gap-4 text-sm items-center '>
            <span>{`Welcome you to website `}</span>
            <span
              onClick={() => dispatch(logout())}
              className='hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2'
            >
              <AiOutlineLogout size={20} />
            </span>
          </div>
        ) : (
          <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>
            Sign In Or Create Account{' '}
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
