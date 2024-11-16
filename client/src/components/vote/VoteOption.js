import React, { memo, useState, useRef, useEffect } from 'react';
import logo from 'assets/logo.png';
import { voteOptions } from 'utils/contants';
import { AiFillStar } from 'react-icons/ai';
import { Button } from 'components';
const VoteOption = ({ nameProduct, handleSubmitVoteoption }) => {
  const modalRef = useRef();
  const [chooseStar, setChooseStar] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(null);
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className='bg-white w-[700px] flex flex-col items-center p-4 gap-4'
    >
      <img src={logo} alt='logo' className='w-[200px] my-2 object-contain' />
      <h1 className='text-center text-medium text-lg '>{`Review and Voting for ${nameProduct} `}</h1>
      <textarea
        className='form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm '
        placeholder='Write something'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className='w-full flex flex-col gap-4'>
        <p>How do you like this product?</p>
        <div className='flex items-center justify-center gap-4'>
          {voteOptions.map((el) => (
            <div
              className='w-[80px] h-[80px] flex flex-col items-center justify-center bg-gray-200 cursor-pointer rounded-md  gap-2'
              key={el.id}
              onClick={() => {
                setChooseStar(el.id);
                setScore(el.id);
              }}
            >
              {Number(chooseStar) && chooseStar >= el.id ? (
                <AiFillStar color='yellow' size={18} />
              ) : (
                <AiFillStar color='gray' size={18} />
              )}

              <span className='text-sm'>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        handleOnClick={() => handleSubmitVoteoption({ comment, score })}
        fw
      >
        Submit
      </Button>
    </div>
  );
};

export default memo(VoteOption);
