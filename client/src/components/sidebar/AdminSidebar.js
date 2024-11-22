import React, { Fragment, memo, useState } from 'react';
import logo from 'assets/logo.png';
import { adminSidebar } from 'utils/contants';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import clsx from 'clsx';
const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-400';
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-500';
const AdminSidebar = () => {
  const [actived, setActived] = useState([]);
  const handleShowTabs = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID));
    else setActived((prev) => [...prev, tabID]);
  };
  return (
    <div className='bg-white h-full py-4'>
      <Link to={'/'} className='flex flex-col justify-center items-center p-4 gap-2'>
        <img src={logo} alt='logo' className='w-[200px] object-contain' />
        <small>Admin Workspace</small>
      </Link>
      <div>
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === 'SINGLE' && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  clsx(isActive && activedStyle, !isActive && notActivedStyle)
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === 'PARENT' && (
              <div
                onClick={() => handleShowTabs(el.id)}
                className='flex flex-col '
              >
                <div className='flex items-center justify-between px-4 py-2 hover:bg-gray-600 cursor-pointer'>
                  <div className='flex items-center gap-2'>
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {actived.some((id) => id === el.id) ? (
                    <AiOutlineCaretRight />
                  ) : (
                    <AiOutlineCaretDown />
                  )}
                </div>
                {actived.some((id) => id === el.id) && (
                  <div className='flex flex-col'>
                    {el.submenu.map((item) => (
                      <NavLink
                        onClick={(e) => e.stopPropagation()}
                        key={item.text}
                        to={item.path}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && notActivedStyle,
                            'pl-[60px]'
                          )
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
