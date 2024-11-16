import React, { memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import path from 'utils/path';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from 'store/user/asyncActions';
import { AiOutlineLogout } from 'react-icons/ai';
import { logout, clearMessage } from 'store/user/userSlice';
import Swal from 'sweetalert2';

const TopHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, current, mes } = useSelector((state) => state.user);
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn]);
  useEffect(() => {
    if (mes)
      Swal.fire('Oops!', mes, 'info').then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
  }, [mes]);

  const handleLogout = () => {
    Swal.fire({
      text: 'Do you want to Log out?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Log out',
    }).then((rs) => {
      if (rs.isConfirmed) {
        dispatch(logout());
        navigate(`/${path.HOME}`);
      }
    });
  };
  return (
    <div className='h-[40px] w-full bg-main flex  items-center justify-center '>
      <div className='w-main flex items-center justify-between text-xs text-white '>
        <span>ORDER ONLINE OR CALL US 09686868686</span>

        {isLoggedIn && current ? (
          <div className='flex gap-4 text-sm items-center '>
            <span>{`Welcome, ${current?.firstname} ${current?.lastname}`}</span>
            <span
              onClick={() => handleLogout()}
              className=' hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-1 mr-[-15px]'
            >
              <AiOutlineLogout size={20} />
            </span>
          </div>
        ) : (
          <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>
            Sign In Or Create Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
