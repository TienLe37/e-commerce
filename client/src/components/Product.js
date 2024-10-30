import React, { useState } from 'react';
import cmsoon from '../assets/cmsoon.jpg';
import hotlabel from '../assets/hotlabel.png';
import newLabel from '../assets/newLabel.png';
import { formatMoney, renderStar } from '../utils/helpers';
import icons from '../utils/icons';
import { SelectOption } from './';
import { Link } from 'react-router-dom';
import path from '../utils/path';
const { BsFillSuitHeartFill, AiFillEye, AiOutlineMenu } = icons;
function Product({ productData, isNew }) {
  const [isShowOption, setisShowOption] = useState(false);
  return (
    <div className='w-full text-base px-[10px]'>
      <Link
        to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
        className='w-full border p-[15px] flex flex-col items-center '
        onMouseEnter={(e) => {
          e.stopPropagation();
          setisShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setisShowOption(false);
        }}
      >
        <div className=' w-full relative'>
          {isShowOption && (
            <div className=' absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top '>
              <SelectOption icons={<AiFillEye />} />
              <SelectOption icons={<AiOutlineMenu />} />
              <SelectOption icons={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={productData?.thumb || cmsoon}
            alt=''
            className='w[243px] h[243px] object-cover '
          />
          <img
            src={isNew ? newLabel : hotlabel}
            alt=''
            className=' absolute top-[-15px] right-[-15px] w-[50px] h-[50px] object-contain '
          />
        </div>
        <div className='  flex flex-col  mt-[15px] items-start gap-1 w-full'>
          <span className='flex h-4'>
            {renderStar(productData.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData.price)} VNĐ`}</span>
        </div>
      </Link>
    </div>
  );
}

export default Product;
