import React from 'react';

const Button = ({
  name,
  handleOnClick,
  style,
  iconBefore,
  iconAfter,
  fw,
  hover,
}) => {
  return (
    <button
      type='button'
      className={
        style
          ? style
          : `px-4 py-2 rounded-md text-white bg-main my-2 ${
              fw ? 'w-full' : 'w-fit'
            }
        ${hover ? 'hover:bg-red-700' : ''}`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}
    >
      {iconBefore}
      <span>{name}</span>
      {iconAfter}
    </button>
  );
};

export default Button;
