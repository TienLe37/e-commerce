import React, { Fragment, memo, useState } from 'react';
import avatar from 'assets/avatarDefault.png';
import { memberSidebar } from 'utils/contants';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-400';
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-500';
const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const { current } = useSelector((state) => state.user);

  const handleShowTabs = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID));
    else setActived((prev) => [...prev, tabID]);
  };
  return (
    <div className='w-[250px] flex-none bg-white h-full py-4'>
      <div  className='w-full flex flex-col justify-center items-center p-4 gap-2 mb-2 border-b-2 '>
        <img src={current?.avatar || avatar} alt='avatar' className='w-[150px] h-[150px] object-cover rounded-full border ' />
        <small className='text-sm font-semibold'>{`${current?.lastname } ${current?.firstname }`}</small>
      </div>
      <div className=''>
        {memberSidebar.map((el) => (
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

export default memo(MemberSidebar);
