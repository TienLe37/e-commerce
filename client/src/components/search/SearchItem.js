import React, { memo, useState, useEffect } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { colors } from 'utils/contants';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import useDebounce from 'hooks/useDebounce';

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
  const [params] = useSearchParams();
  const { category } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState({
    from: '',
    to: '',
  });
  useEffect(() => {
    let queries = {};
    for (let i of params) queries[i[0]] = i[1];
    if (selected.length > 0) {
      queries.color = selected.join(',');
      queries.page = 1;
    } else delete queries.color;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [selected]);

  const debouncePriceFrom = useDebounce(price.from, 700);
  const debouncePriceTo = useDebounce(price.to, 700);
  useEffect(() => {
    let queries = {};
    for (let i of params) queries[i[0]] = i[1];
    if (Number(price.from) > 0) queries.from = price.from;
    else delete queries.from;
    if (Number(price.to) > 0) queries.to = price.to;
    else delete queries.to;
    queries.page = 1;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [debouncePriceFrom, debouncePriceTo]);
  useEffect(() => {
    if (price.from && price.to && price.from > price.to)
      return alert('Price from cannot greater than price to');
  }, [price]);

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
          {type === 'input' && (
            <div>
              <div className='p-2 items-center flex justify-between'>
                <span>Price</span>
                <span
                  className='underline cursor-pointer hover:text-main'
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({ from: '', to: '' });
                  }}
                >
                  Reset
                </span>
              </div>
              <div className='flex flex-col items-center p-2 gap-2'>
                <div className='flex items-center gap-2'>
                  <label htmlFor='from'>from</label>
                  <input
                    className='form-input'
                    type='number'
                    id='from'
                    value={price.from}
                    onChange={(e) =>
                      setPrice((pre) => ({ ...pre, from: e.target.value }))
                    }
                  />
                </div>
                <div className='flex items-center gap-2 ml-[14px]'>
                  <label htmlFor='to'>to</label>
                  <input
                    className='form-input'
                    type='number'
                    id='to'
                    value={price.to}
                    onChange={(e) =>
                      setPrice((pre) => ({ ...pre, to: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
