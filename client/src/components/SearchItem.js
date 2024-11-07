import React, { memo, useState, useEffect } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { colors } from '../utils/contants';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';

const SearchItem = ({
  name,
  activeClick,
  changeActiveFilter,
  type = 'checkbox',
}) => {
  const [selected, setSelected] = useState([]);
  const handleSelect = (e) => {
    const alreadyEl = selected.find((el) => el === e.target.value);
    if (alreadyEl)
      setSelected((prev) => prev.filter((el) => el !== e.target.value));
    else setSelected((prev) => [...prev, e.target.value]);
  };

  const { category } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ color: selected.join(',') }).toString(),
      });
    } else navigate(`/${category}`);
  }, [selected]);

  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className='p-3 gap-2 text-gray-500 text-xs relative border cursor-pointer border-gray-500 flex justify-between items-center '
    >
      <span>{name}</span>
      <AiOutlineDown />
      {activeClick === name && (
        <div
          onClick={(e) => e.stopPropagation()}
          className='absolute top-[calc(100%+1px)] z-10 left-0 right-0  p-4 border shadow-xl bg-white w-fit min-w-[178px]'
        >
          {type === 'checkbox' && (
            <div>
              <div className='py-4 flex items-center justify-between gap-8 border-b'>
                <span className='whitespace-nowrap '>{`${selected.length} selected`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                  }}
                  className='underline cursor-pointer hover:text-main'
                >
                  Reset
                </span>
              </div>
              <div className='flex flex-col gap-3 mt-4'>
                {colors.map((el, index) => (
                  <div key={index} className='flex items-center gap-4'>
                    <input
                      type='checkbox'
                      value={el}
                      onChange={handleSelect}
                      id={el}
                      checked={selected?.some((item) => item === el)}
                      className='outline-none'
                    />
                    <label htmlFor={el} className=' capitalize text-gray-700 '>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
