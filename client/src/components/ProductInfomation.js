import React, { memo, useState } from 'react';
import { productInfoTabs } from '../utils/contants';
import { Button, Votebar, VoteOption } from './';
import { renderStar } from '../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../store/app/appSlice';
import { apiRatings } from '../apis';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../utils/path';

const ProductInfomation = ({
  totalRatings,
  ratings,
  nameProduct,
  pid,
  reRenderAfterVote,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const handleSubmitVoteoption = async ({ score, comment }) => {
    if (!comment || !score || !pid) {
      alert('Please vote before submit');
      return;
    }
    await apiRatings({ star: score, comment, pid });
    reRenderAfterVote();
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
  };
  const handleRatingNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: 'Go Login to Vote and Review',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Go Login',
        title: 'Oop!',
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.LOGIN}`);
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              handleSubmitVoteoption={handleSubmitVoteoption}
              nameProduct={nameProduct}
            />
          ),
        })
      );
    }
  };
  return (
    <div>
      <div className='flex items-center gap-2 relative bottom-[-1px]'>
        {productInfoTabs.map((el) => (
          <span
            className={`py-2 px-4 cursor-pointer ${
              activeTab === +el.id
                ? 'bg-white border border-b-0'
                : 'bg-gray-200'
            }`}
            key={el.id}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className='w-full border p-4 h-[300px]'>
        {productInfoTabs.map((el) => (
          <p>{el.id === activeTab && el.content}</p>
        ))}
      </div>
      <h3 className='text-[20px]  font-semibold py-[20px] border-b-2 border-main uppercase  '>
        reviews and ratings product
      </h3>
      <div className='flex p-4'>
        <div className='flex-4 flex flex-col gap-3 items-center justify-center border-[3px] border-red-500'>
          <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
          <span className='flex items-center gap-1'>
            {renderStar(totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className='text-xl'>{`${ratings?.length} reviews`} </span>
        </div>
        <div className='flex-6 border flex gap-2 flex-col p-4 '>
          {Array.from(Array(5).keys())
            .reverse()
            .map((el) => (
              <Votebar
                key={el}
                number={el + 1}
                ratingTotal={ratings?.length}
                ratingCount={
                  ratings?.filter((item) => item.star === el + 1)?.length
                }
              />
            ))}
        </div>
      </div>
      <div className='flex flex-col justify-center items-center text-sm p-4 gap-2`'>
        <span>Do you review this product?</span>
        <Button handleOnClick={handleRatingNow}>Rating now!</Button>
      </div>
    </div>
  );
};

export default memo(ProductInfomation);
