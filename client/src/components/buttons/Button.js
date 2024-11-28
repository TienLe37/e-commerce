import React, { memo } from 'react';

const Button = ({
  children,
  handleOnClick,
  style,
  fw,
  hover,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={style ? style : `px-4 py-2 rounded-md  text-white bg-main my-2 
        ${ fw ? 'w-full' : 'w-fit'}
        ${hover ? 'hover:bg-red-700' : ''}`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}
    >
      {children}
    </button>
  );
};

export default memo(Button);
